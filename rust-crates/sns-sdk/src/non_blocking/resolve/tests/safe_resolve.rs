use super::fixtures::{registry_account, srs_account, test_client, TEST_NOW};
use super::*;
use crate::utils::test::{account_response, multiple_accounts_response, TestRpcSender};
use solana_client::{rpc_client::RpcClientConfig, rpc_request::RpcRequest};
use solana_program::{pubkey, pubkey::Pubkey};

#[tokio::test]
async fn safe_resolve_sol_returns_matching_srs_and_sns_target() {
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
        safe_resolve_with_config(&client, "domain.sol", AllowPda::Deny, TEST_NOW)
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
async fn safe_resolve_sol_rejects_mismatching_srs_and_sns_targets() {
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

    let error = safe_resolve_with_config(&client, "domain.sol", AllowPda::Deny, TEST_NOW)
        .await
        .unwrap_err();
    assert!(matches!(error, SnsError::SnsSolResolutionMismatch));
}

#[tokio::test]
async fn safe_resolve_sns_uses_ordinary_sns_resolution() {
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
        safe_resolve_with_config(&client, "domain.sns", AllowPda::Deny, TEST_NOW)
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
async fn safe_resolve_sol_propagates_resolution_errors() {
    let registry = registry_account(Pubkey::new_unique());
    let sender = TestRpcSender::new("nb-safe-error")
        .with_error(RpcRequest::GetAccountInfo, "RPC unavailable")
        .with_response(
            RpcRequest::GetMultipleAccounts,
            multiple_accounts_response(&[None, None, None, Some(&registry)]),
        );
    let client =
        RpcClient::new_sender(sender, RpcClientConfig::with_commitment(Default::default()));

    assert!(matches!(
        safe_resolve_with_config(&client, "domain.sol", AllowPda::Deny, TEST_NOW).await,
        Err(SnsError::SolanaClient(_))
    ));
}

#[tokio::test]
async fn safe_resolve_sol_applies_the_same_pda_policy_to_both_paths() {
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
        safe_resolve_with_config(&client, "domain.sol", AllowPda::AllowAny, TEST_NOW)
            .await
            .unwrap(),
        owner
    );
}
