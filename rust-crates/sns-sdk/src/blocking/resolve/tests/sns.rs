use super::*;
use crate::{
    derivation::{get_domain_mint, get_sns_domain_key},
    utils::test::multiple_accounts_response,
};

#[test]
fn rejects_missing_or_invalid_sns_registry_accounts() {
    let (client, sender) = test_client("blocking-sns-missing-domain", []);
    assert!(matches!(
        resolve_with_config(&client, "missing.sns", AllowPda::Deny, true, TEST_NOW),
        Err(SnsError::DomainDoesNotExist)
    ));
    assert_eq!(
        sender
            .requests()
            .iter()
            .map(|(request, _)| *request)
            .collect::<Vec<_>>(),
        vec![RpcRequest::GetMultipleAccounts]
    );

    let mut wrong_owner = registry_account(Pubkey::new_unique());
    wrong_owner.owner = Pubkey::new_unique();
    let (client, _) = test_client(
        "blocking-sns-registry-wrong-owner",
        [(
            RpcRequest::GetMultipleAccounts,
            multiple_accounts_response(&[None, None, None, Some(&wrong_owner)]),
        )],
    );
    assert!(matches!(
        resolve_with_config(&client, "forged.sns", AllowPda::Deny, false, TEST_NOW),
        Err(SnsError::InvalidNameAccountData)
    ));
}

/// An active tokenization record without a holder cannot fall back to SOL
/// record V2, SOL record V1, or the name registry owner.
#[test]
fn rejects_active_sns_nft_without_holder() {
    let domain = "active";
    let domain_key = get_sns_domain_key(domain).unwrap().key;
    let mint_key = get_domain_mint(&domain_key);
    let registry = registry_account(Pubkey::new_unique());
    let nft_record = active_nft_record_account(domain_key, mint_key);
    let initial = multiple_accounts_response(&[Some(&nft_record), None, None, Some(&registry)]);

    let (client, _) = test_client(
        "blocking-sns-active-missing-holder",
        [(RpcRequest::GetMultipleAccounts, initial)],
    );
    assert!(matches!(
        resolve_with_config(&client, "active.sns", AllowPda::Deny, false, TEST_NOW),
        Err(SnsError::CouldNotFindNftOwner)
    ));
}
