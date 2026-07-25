use super::*;
use crate::utils::test::{account_response, multiple_accounts_response};

#[tokio::test]
async fn name_registry_resolvers_validate_accounts() {
    let owner = Pubkey::new_unique();
    let mut valid = registry_account(owner);
    valid.data.extend_from_slice(b"payload");
    let (client, _) = test_client(
        "nb-name-registry-valid",
        [(RpcRequest::GetAccountInfo, account_response(Some(&valid)))],
    );
    let (header, payload) = resolve_name_registry(&client, &Pubkey::new_unique())
        .await
        .unwrap()
        .unwrap();
    assert_eq!(header.owner, owner);
    assert_eq!(payload, b"payload");

    let (client, _) = test_client("nb-name-registry-missing", []);
    assert!(resolve_name_registry(&client, &Pubkey::new_unique())
        .await
        .unwrap()
        .is_none());

    let mut wrong_owner = registry_account(Pubkey::new_unique());
    wrong_owner.owner = Pubkey::new_unique();
    let undersized = Account {
        data: vec![0; NameRecordHeader::LEN - 1],
        owner: spl_name_service::ID,
        ..Account::default()
    };
    for (endpoint, account) in [
        ("nb-name-registry-wrong-owner", &wrong_owner),
        ("nb-name-registry-undersized", &undersized),
    ] {
        let (client, _) = test_client(
            endpoint,
            [(RpcRequest::GetAccountInfo, account_response(Some(account)))],
        );
        assert!(matches!(
            resolve_name_registry(&client, &Pubkey::new_unique()).await,
            Err(SnsError::InvalidNameAccountData)
        ));
    }

    let (client, _) = test_client(
        "nb-name-registry-batch-wrong-owner",
        [(
            RpcRequest::GetMultipleAccounts,
            multiple_accounts_response(&[Some(&valid), None, Some(&wrong_owner)]),
        )],
    );
    assert!(matches!(
        resolve_name_registry_batch(
            &client,
            &[
                Pubkey::new_unique(),
                Pubkey::new_unique(),
                Pubkey::new_unique()
            ]
        )
        .await,
        Err(SnsError::InvalidNameAccountData)
    ));
}
