use solana_client::nonblocking::rpc_client::RpcClient;
use solana_program::pubkey::Pubkey;

use crate::{
    error::SnsError,
    primary_domain::{derive_primary_domain_key, PrimaryDomain},
    NAME_OFFERS_PROGRAM_ID,
};

pub async fn get_primary_domain(
    rpc_client: &RpcClient,
    owner: &Pubkey,
) -> Result<Option<Pubkey>, SnsError> {
    let primary_domain_state_key = derive_primary_domain_key(owner);
    let account = rpc_client
        .get_account_with_commitment(&primary_domain_state_key, rpc_client.commitment())
        .await?
        .value;
    if let Some(a) = account {
        if a.owner != NAME_OFFERS_PROGRAM_ID {
            return Err(SnsError::InvalidNameAccountData);
        }
        let parsed = PrimaryDomain::parse(&a.data)?;
        Ok(Some(parsed.name_account))
    } else {
        Ok(None)
    }
}

#[cfg(test)]
mod account_tests {
    use super::*;
    use crate::utils::test::{account_response, TestRpcSender};
    use serde_json::json;
    use solana_client::{rpc_client::RpcClientConfig, rpc_request::RpcRequest};
    use solana_sdk::account::Account;

    fn primary_domain_account(tag: u8, name_account: Pubkey, owner: Pubkey) -> Account {
        let mut data = vec![tag];
        data.extend_from_slice(name_account.as_ref());
        Account {
            data,
            owner,
            ..Account::default()
        }
    }

    fn test_client(endpoint: &str, account: Option<&Account>) -> RpcClient {
        let sender = TestRpcSender::new(endpoint, json!(0))
            .with_response(RpcRequest::GetAccountInfo, account_response(account));
        RpcClient::new_sender(sender, RpcClientConfig::with_commitment(Default::default()))
    }

    #[tokio::test]
    async fn primary_domain_account_absent_returns_none() {
        let client = test_client("nb-primary-domain-absent", None);

        assert_eq!(
            get_primary_domain(&client, &Pubkey::new_unique())
                .await
                .unwrap(),
            None
        );
    }

    #[tokio::test]
    async fn primary_domain_account_valid_returns_name_account() {
        let name_account = Pubkey::new_unique();
        let account = primary_domain_account(4, name_account, NAME_OFFERS_PROGRAM_ID);
        let client = test_client("nb-primary-domain-valid", Some(&account));

        assert_eq!(
            get_primary_domain(&client, &Pubkey::new_unique())
                .await
                .unwrap(),
            Some(name_account)
        );
    }

    #[tokio::test]
    async fn primary_domain_account_wrong_owner_is_rejected() {
        let account = primary_domain_account(4, Pubkey::new_unique(), Pubkey::new_unique());
        let client = test_client("nb-primary-domain-wrong-owner", Some(&account));

        assert!(matches!(
            get_primary_domain(&client, &Pubkey::new_unique()).await,
            Err(SnsError::InvalidNameAccountData)
        ));
    }

    #[tokio::test]
    async fn primary_domain_account_truncated_data_is_rejected() {
        let account = Account {
            data: vec![4],
            owner: NAME_OFFERS_PROGRAM_ID,
            ..Account::default()
        };
        let client = test_client("nb-primary-domain-truncated", Some(&account));

        assert!(matches!(
            get_primary_domain(&client, &Pubkey::new_unique()).await,
            Err(SnsError::BorshError(_))
        ));
    }

    #[tokio::test]
    async fn primary_domain_account_wrong_tag_is_rejected() {
        let account = primary_domain_account(0, Pubkey::new_unique(), NAME_OFFERS_PROGRAM_ID);
        let client = test_client("nb-primary-domain-wrong-tag", Some(&account));

        assert!(matches!(
            get_primary_domain(&client, &Pubkey::new_unique()).await,
            Err(SnsError::BorshError(_))
        ));
    }
}

#[cfg(all(test, not(feature = "devnet")))]
mod tests {
    use super::*;
    use dotenv::dotenv;
    use solana_program::pubkey;

    #[tokio::test]
    async fn test_get_primary_domain() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        for (owner, expected) in [
            (
                pubkey!("FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ"),
                pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"),
            ),
            (
                pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v"),
                pubkey!("AgJujvNQgYESUwBPitq2VUrfTaT2bvueHbgvsxqZ2sHg"),
            ),
        ] {
            assert_eq!(
                get_primary_domain(&client, &owner).await.unwrap(),
                Some(expected)
            );
        }
    }
}
