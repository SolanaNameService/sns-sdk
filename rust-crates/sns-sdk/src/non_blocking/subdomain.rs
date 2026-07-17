use solana_account_decoder::UiAccountEncoding;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_client::{
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, RpcFilterType},
};
use solana_program::{program_pack::Pack, pubkey::Pubkey};
use spl_name_service::state::NameRecordHeader;

use crate::{derivation::REVERSE_LOOKUP_CLASS, error::SnsError};

#[cfg(feature = "subdomain")]
use crate::{derivation::get_sns_domain_key, non_blocking::tld::assert_tld_supported};
#[cfg(feature = "subdomain")]
use borsh::BorshDeserialize;
#[cfg(feature = "subdomain")]
use solana_sdk::account::Account;

#[cfg(feature = "subdomain")]
pub use sub_registrar::state::registry::Registrar;
#[cfg(feature = "subdomain")]
pub use sub_registrar::state::Tag as SubRegistrarAccountTag;
#[cfg(feature = "subdomain")]
pub use sub_registrar::ID as SUB_REGISTRAR_PROGRAM_ID;

pub async fn get_subdomains(
    rpc_client: &RpcClient,
    parent: &Pubkey,
) -> Result<Vec<String>, SnsError> {
    let config = RpcProgramAccountsConfig {
        filters: Some(vec![
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(0, parent.to_bytes().to_vec())),
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(
                64,
                REVERSE_LOOKUP_CLASS.to_bytes().to_vec(),
            )),
        ]),
        with_context: None,
        account_config: RpcAccountInfoConfig {
            encoding: Some(UiAccountEncoding::Base64),
            ..Default::default()
        },
        sort_results: None,
    };
    let res = rpc_client
        .get_program_accounts_with_config(&spl_name_service::ID, config)
        .await?;

    let mut results = Vec::with_capacity(res.len());
    for (_, acc) in res {
        let payload = acc
            .data
            .get(NameRecordHeader::LEN..)
            .ok_or(SnsError::InvalidNameAccountData)?;
        let len_data = payload.get(..4).ok_or(SnsError::InvalidReverse)?;
        let len = u32::from_le_bytes(len_data.try_into().map_err(|_| SnsError::InvalidReverse)?);
        let label_data = payload
            .get(4..4 + len as usize)
            .ok_or(SnsError::InvalidReverse)?;
        let label = String::from_utf8(label_data.to_vec()).map_err(|_| SnsError::InvalidReverse)?;
        let subdomain = label
            .strip_prefix('\0')
            .ok_or(SnsError::InvalidReverse)?
            .to_owned();
        results.push(subdomain);
    }
    Ok(results)
}

#[cfg(all(test, not(feature = "devnet")))]
mod tests {
    use super::*;
    use crate::derivation::get_sns_domain_key;
    use dotenv::dotenv;

    #[tokio::test]
    async fn test_get_subdomains() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let parent = get_sns_domain_key("bonfida").unwrap().key;
        let mut reverse = get_subdomains(&client, &parent).await.unwrap();
        reverse.sort();
        assert_eq!(reverse, vec!["dex", "naming", "test"]);
    }
}

#[cfg(feature = "subdomain")]
pub async fn get_sub_registrar_info(
    rpc_client: &RpcClient,
    domain: &str,
) -> Result<Registrar, SnsError> {
    let (domain, _) = assert_tld_supported(rpc_client, domain).await?;
    let key = get_sns_domain_key(domain)?.key;
    let registrar_key = Registrar::find_key(&key, &SUB_REGISTRAR_PROGRAM_ID).0;
    let account = rpc_client
        .get_account_with_commitment(&registrar_key, rpc_client.commitment())
        .await?
        .value
        .ok_or(SnsError::InvalidSubRegistrar)?;
    deserialize_sub_registrar(&account)
}

#[cfg(feature = "subdomain")]
fn deserialize_sub_registrar(account: &Account) -> Result<Registrar, SnsError> {
    if account.owner != SUB_REGISTRAR_PROGRAM_ID
        || account.data.first().copied() != Some(SubRegistrarAccountTag::Registrar as u8)
    {
        return Err(SnsError::InvalidSubRegistrar);
    }
    Registrar::deserialize(&mut account.data.as_slice()).map_err(|_| SnsError::InvalidSubRegistrar)
}

#[cfg(all(test, feature = "subdomain"))]
mod sub_registrar_tests {
    use {
        super::*,
        crate::utils::test::{account_response, TestRpcSender},
        borsh::BorshSerialize,
        serde_json::json,
        solana_client::{rpc_client::RpcClientConfig, rpc_request::RpcRequest},
    };

    fn registrar_account(registrar: &Registrar) -> Account {
        let mut data = Vec::new();
        registrar.serialize(&mut data).unwrap();
        Account {
            data,
            owner: SUB_REGISTRAR_PROGRAM_ID,
            ..Account::default()
        }
    }

    fn test_client(endpoint: &str, account: Option<&Account>) -> RpcClient {
        let sender = TestRpcSender::new(endpoint, json!(0))
            .with_response(RpcRequest::GetAccountInfo, account_response(account));
        RpcClient::new_sender(sender, RpcClientConfig::with_commitment(Default::default()))
    }

    #[tokio::test]
    async fn resolves_valid_sub_registrar() {
        let registrar = Registrar {
            tag: SubRegistrarAccountTag::Registrar,
            authority: Pubkey::new_unique(),
            domain_account: Pubkey::new_unique(),
            ..Registrar::default()
        };
        let account = registrar_account(&registrar);
        let client = test_client("nb-sub-registrar-valid", Some(&account));

        assert_eq!(
            get_sub_registrar_info(&client, "registrar.sns")
                .await
                .unwrap(),
            registrar
        );
    }

    #[tokio::test]
    async fn rejects_invalid_sub_registrar_accounts() {
        let registrar = Registrar {
            tag: SubRegistrarAccountTag::Registrar,
            ..Registrar::default()
        };
        let mut wrong_owner = registrar_account(&registrar);
        wrong_owner.owner = Pubkey::new_unique();
        let mut wrong_discriminator = registrar_account(&registrar);
        wrong_discriminator.data[0] = SubRegistrarAccountTag::ClosedRegistrar as u8;

        for (endpoint, account) in [
            ("nb-sub-registrar-missing", None),
            (
                "nb-sub-registrar-empty",
                Some(Account {
                    owner: SUB_REGISTRAR_PROGRAM_ID,
                    ..Account::default()
                }),
            ),
            ("nb-sub-registrar-wrong-owner", Some(wrong_owner)),
            (
                "nb-sub-registrar-wrong-discriminator",
                Some(wrong_discriminator),
            ),
            (
                "nb-sub-registrar-malformed",
                Some(Account {
                    data: vec![SubRegistrarAccountTag::Registrar as u8],
                    owner: SUB_REGISTRAR_PROGRAM_ID,
                    ..Account::default()
                }),
            ),
        ] {
            let client = test_client(endpoint, account.as_ref());
            assert!(matches!(
                get_sub_registrar_info(&client, "registrar.sns").await,
                Err(SnsError::InvalidSubRegistrar)
            ));
        }
    }
}
