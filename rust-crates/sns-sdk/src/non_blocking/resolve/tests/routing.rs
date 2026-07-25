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
