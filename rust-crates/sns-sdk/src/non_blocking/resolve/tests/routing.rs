use super::*;
use crate::{config::SOL_TLD_CUTOFF_SLOT, utils::test::multiple_accounts_response};
use solana_program::pubkey;

#[tokio::test]
async fn sns_resolves_via_sns_regardless_of_srs_setting() {
    let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
    let registry = registry_account(owner);

    for srs_enabled in [false, true] {
        let (client, sender) = test_client(
            &format!("nb-sns-routing-{srs_enabled}"),
            [(
                RpcRequest::GetMultipleAccounts,
                multiple_accounts_response(&[None, None, None, Some(&registry)]),
            )],
        );
        assert_eq!(
            resolve_with_config(&client, "domain.sns", AllowPda::Deny, srs_enabled, TEST_NOW,)
                .await
                .unwrap(),
            owner
        );
        assert_eq!(
            sender
                .requests()
                .iter()
                .map(|(request, _)| *request)
                .collect::<Vec<_>>(),
            vec![RpcRequest::GetMultipleAccounts]
        );
    }
}

/// Enabled `.sol` resolution requests only the canonical SRS record.
#[tokio::test]
async fn sol_resolves_via_srs_when_srs_is_enabled() {
    let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
    let account = srs_account(SrsRecordOwner::Pubkey(owner));
    let (client, sender) = test_client(
        "nb-srs-direct",
        [(RpcRequest::GetAccountInfo, account_response(Some(&account)))],
    );
    assert_eq!(
        resolve_with_config(&client, "bonfida.sol", AllowPda::Deny, true, TEST_NOW)
            .await
            .unwrap(),
        owner
    );
    assert_eq!(
        sender
            .requests()
            .iter()
            .map(|(request, _)| *request)
            .collect::<Vec<_>>(),
        vec![RpcRequest::GetAccountInfo]
    );
}

#[tokio::test]
async fn safe_sol_returns_matching_srs_and_sns_target() {
    let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
    let srs = srs_account(SrsRecordOwner::Pubkey(owner));
    let registry = registry_account(owner);
    let (client, sender) = test_client(
        "nb-safe-matching",
        [
            (RpcRequest::GetAccountInfo, account_response(Some(&srs))),
            (
                RpcRequest::GetMultipleAccounts,
                multiple_accounts_response(&[None, None, None, Some(&registry)]),
            ),
        ],
    );

    assert_eq!(
        safe_resolve_with_config(&client, "domain.sol", AllowPda::Deny, true, TEST_NOW)
            .await
            .unwrap(),
        owner
    );
    let requests = sender
        .requests()
        .into_iter()
        .map(|(request, _)| request)
        .collect::<Vec<_>>();
    assert_eq!(requests.len(), 2);
    assert!(requests.contains(&RpcRequest::GetAccountInfo));
    assert!(requests.contains(&RpcRequest::GetMultipleAccounts));
}

#[tokio::test]
async fn safe_sol_rejects_mismatching_srs_and_sns_targets() {
    let srs_target = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
    let sns_target = pubkey!("CLqjqVvR7StbUWbCjRfmeF3b4jCeyxPvL66qBNHBoTwm");
    let srs = srs_account(SrsRecordOwner::Pubkey(srs_target));
    let registry = registry_account(sns_target);
    let (client, _) = test_client(
        "nb-safe-mismatch",
        [
            (RpcRequest::GetAccountInfo, account_response(Some(&srs))),
            (
                RpcRequest::GetMultipleAccounts,
                multiple_accounts_response(&[None, None, None, Some(&registry)]),
            ),
        ],
    );

    let error = safe_resolve_with_config(&client, "domain.sol", AllowPda::Deny, true, TEST_NOW)
        .await
        .unwrap_err();
    assert!(matches!(error, SnsError::SnsSolResolutionMismatch));
}

#[tokio::test]
async fn safe_sns_uses_ordinary_sns_resolution() {
    let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
    let registry = registry_account(owner);
    let (client, sender) = test_client(
        "nb-safe-sns",
        [(
            RpcRequest::GetMultipleAccounts,
            multiple_accounts_response(&[None, None, None, Some(&registry)]),
        )],
    );

    assert_eq!(
        safe_resolve_with_config(&client, "domain.sns", AllowPda::Deny, true, TEST_NOW)
            .await
            .unwrap(),
        owner
    );
    assert_eq!(
        sender
            .requests()
            .iter()
            .map(|(request, _)| *request)
            .collect::<Vec<_>>(),
        vec![RpcRequest::GetMultipleAccounts]
    );
}

#[tokio::test]
async fn safe_sol_preserves_disabled_srs_routing() {
    let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
    let registry = registry_account(owner);
    let (client, sender) = test_client(
        "nb-safe-srs-disabled",
        [(
            RpcRequest::GetMultipleAccounts,
            multiple_accounts_response(&[None, None, None, Some(&registry)]),
        )],
    );

    assert_eq!(
        safe_resolve_with_config(&client, "domain.sol", AllowPda::Deny, false, TEST_NOW)
            .await
            .unwrap(),
        owner
    );
    assert_eq!(
        sender
            .requests()
            .iter()
            .map(|(request, _)| *request)
            .collect::<Vec<_>>(),
        vec![RpcRequest::GetSlot, RpcRequest::GetMultipleAccounts]
    );
}

#[tokio::test]
async fn safe_sol_propagates_resolution_errors() {
    let registry = registry_account(Pubkey::new_unique());
    let sender = TestRpcSender::new("nb-safe-error", json!(0))
        .with_error(RpcRequest::GetAccountInfo, "RPC unavailable")
        .with_response(
            RpcRequest::GetMultipleAccounts,
            multiple_accounts_response(&[None, None, None, Some(&registry)]),
        );
    let client =
        RpcClient::new_sender(sender, RpcClientConfig::with_commitment(Default::default()));

    assert!(matches!(
        safe_resolve_with_config(&client, "domain.sol", AllowPda::Deny, true, TEST_NOW).await,
        Err(SnsError::SolanaClient(_))
    ));
}

#[tokio::test]
async fn safe_sol_applies_the_same_pda_policy_to_both_paths() {
    let owner = Pubkey::find_program_address(&[b"safe-resolve"], &Pubkey::new_unique()).0;
    let srs = srs_account(SrsRecordOwner::Pubkey(owner));
    let registry = registry_account(owner);
    let (client, _) = test_client(
        "nb-safe-pda-policy",
        [
            (RpcRequest::GetAccountInfo, account_response(Some(&srs))),
            (
                RpcRequest::GetMultipleAccounts,
                multiple_accounts_response(&[None, None, None, Some(&registry)]),
            ),
        ],
    );

    assert_eq!(
        safe_resolve_with_config(&client, "domain.sol", AllowPda::AllowAny, true, TEST_NOW)
            .await
            .unwrap(),
        owner
    );
}

#[tokio::test]
async fn sol_resolves_via_sns_before_cutoff_when_srs_is_disabled() {
    let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
    let registry = registry_account(owner);
    let (client, sender) = test_client(
        "nb-sns-sol-before-cutoff",
        [(
            RpcRequest::GetMultipleAccounts,
            multiple_accounts_response(&[None, None, None, Some(&registry)]),
        )],
    );
    assert_eq!(
        resolve_with_config(&client, "domain.sol", AllowPda::Deny, false, TEST_NOW)
            .await
            .unwrap(),
        owner
    );
    assert_eq!(
        sender
            .requests()
            .iter()
            .map(|(request, _)| *request)
            .collect::<Vec<_>>(),
        vec![RpcRequest::GetSlot, RpcRequest::GetMultipleAccounts]
    );
}

#[tokio::test]
async fn sol_is_not_resolved_after_cutoff_when_srs_is_disabled() {
    let (client, sender) = test_client(
        "nb-sns-sol-after-cutoff",
        [(RpcRequest::GetSlot, json!(SOL_TLD_CUTOFF_SLOT + 1))],
    );
    assert!(matches!(
        resolve_with_config(&client, "domain.sol", AllowPda::Deny, false, TEST_NOW).await,
        Err(SnsError::UnsupportedTld)
    ));
    assert_eq!(
        sender
            .requests()
            .iter()
            .map(|(request, _)| *request)
            .collect::<Vec<_>>(),
        vec![RpcRequest::GetSlot]
    );
}

#[tokio::test]
async fn rejects_unsupported_tld() {
    let (client, sender) = test_client("nb-srs-unsupported", []);
    assert!(matches!(
        resolve_with_config(&client, "future.eth", AllowPda::Deny, true, TEST_NOW).await,
        Err(SnsError::UnsupportedTld)
    ));
    assert!(sender.requests().is_empty());
}
