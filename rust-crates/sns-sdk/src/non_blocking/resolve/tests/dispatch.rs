use super::fixtures::{registry_account, srs_account, test_client, TEST_NOW};
use super::*;
use crate::{
    resolve::SrsRecordOwner,
    utils::test::{account_response, multiple_accounts_response},
};
use solana_client::rpc_request::RpcRequest;
use solana_program::pubkey;

#[tokio::test]
async fn sns_resolves_via_spl_name_service() {
    let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
    let registry = registry_account(owner);
    let (client, sender) = test_client(
        "nb-sns-routing",
        [(
            RpcRequest::GetMultipleAccounts,
            multiple_accounts_response(&[None, None, None, Some(&registry)]),
        )],
    );

    assert_eq!(
        resolve_with_config(&client, "domain.sns", AllowPda::Deny, TEST_NOW)
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
async fn sol_resolves_via_srs_without_slot_lookup() {
    let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
    let account = srs_account(SrsRecordOwner::Pubkey(owner));
    let (client, sender) = test_client(
        "nb-srs-direct",
        [(RpcRequest::GetAccountInfo, account_response(Some(&account)))],
    );

    assert_eq!(
        resolve_with_config(&client, "bonfida.sol", AllowPda::Deny, TEST_NOW)
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
async fn rejects_unsupported_tld() {
    let (client, sender) = test_client("nb-unsupported-tld", []);
    assert!(matches!(
        resolve_with_config(&client, "future.eth", AllowPda::Deny, TEST_NOW).await,
        Err(SnsError::UnsupportedTld)
    ));
    assert!(sender.requests().is_empty());
}
