use solana_account_decoder::{UiAccountEncoding, UiDataSliceConfig};
use solana_client::{
    rpc_client::RpcClient,
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, RpcFilterType},
};
use solana_program::pubkey::Pubkey;

use crate::{
    derivation::{ROOT_DOMAIN_ACCOUNT, SOL_SRS_CLASS, SRS_PROGRAM_ID},
    domain::SolDomain,
    error::SnsError,
    resolve::{
        current_unix_timestamp, parse_srs_record, parse_srs_record_metadata_name, SrsRecordOwner,
        SRS_OWNER_TYPE_PUBKEY, SRS_RECORD_CLASS_OFFSET, SRS_RECORD_DISCRIMINATOR,
        SRS_RECORD_OWNER_OFFSET, SRS_RECORD_OWNER_TYPE_OFFSET,
    },
};

pub fn get_sns_domains_for_owner(
    rpc_client: &RpcClient,
    owner: Pubkey,
) -> Result<Vec<Pubkey>, SnsError> {
    let config = RpcProgramAccountsConfig {
        filters: Some(vec![
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(32, owner.to_bytes().to_vec())),
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(
                0,
                ROOT_DOMAIN_ACCOUNT.to_bytes().to_vec(),
            )),
        ]),
        with_context: None,
        account_config: RpcAccountInfoConfig {
            encoding: Some(UiAccountEncoding::Base64),
            data_slice: Some(UiDataSliceConfig {
                offset: 0,
                length: 0,
            }),
            ..Default::default()
        },
        sort_results: None,
    };
    let res = rpc_client.get_program_ui_accounts_with_config(&spl_name_service::ID, config)?;
    Ok(res.into_iter().map(|x| x.0).collect())
}

pub fn get_sol_domains_for_owner(
    rpc_client: &RpcClient,
    owner: Pubkey,
) -> Result<Vec<SolDomain>, SnsError> {
    let config = RpcProgramAccountsConfig {
        filters: Some(vec![
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(0, vec![SRS_RECORD_DISCRIMINATOR])),
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(
                SRS_RECORD_CLASS_OFFSET,
                SOL_SRS_CLASS.to_bytes().to_vec(),
            )),
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(
                SRS_RECORD_OWNER_TYPE_OFFSET,
                vec![SRS_OWNER_TYPE_PUBKEY],
            )),
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(
                SRS_RECORD_OWNER_OFFSET,
                owner.to_bytes().to_vec(),
            )),
        ]),
        with_context: None,
        account_config: RpcAccountInfoConfig {
            encoding: Some(UiAccountEncoding::Base64),
            ..Default::default()
        },
        sort_results: None,
    };
    let accounts = rpc_client.get_program_ui_accounts_with_config(&SRS_PROGRAM_ID, config)?;
    let now = current_unix_timestamp();

    let mut domains = Vec::new();
    for (key, ui_account) in accounts {
        let Some(account) = ui_account.to_account() else {
            continue;
        };
        if let Ok(SrsRecordOwner::Pubkey(_)) = parse_srs_record(&account.owner, &account.data, now)
        {
            if let Ok(domain) = parse_srs_record_metadata_name(&account.data) {
                domains.push(SolDomain { domain, key });
            }
        }
    }
    Ok(domains)
}

#[cfg(all(test, not(feature = "devnet")))]
mod tests {
    use super::*;
    use crate::derivation::get_sol_domain_key;
    use dotenv::dotenv;
    use solana_program::pubkey;

    #[test]
    fn test_get_sns_domains_for_owner() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let mut domains = get_sns_domains_for_owner(
            &client,
            pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
        )
        .unwrap()
        .into_iter()
        .map(|p| p.to_string())
        .collect::<Vec<_>>();
        domains.sort();

        assert_eq!(
            domains,
            vec![
                "2NsGScxHd9bS6gA7tfY3xucCcg6H9qDqLdXLtAYFjCVR",
                "6Yi9GyJKoFAv77pny4nxBqYYwFaAZ8dNPZX9HDXw5Ctw",
                "8XXesVR1EEsCEePAEyXPL9A4dd9Bayhu9MRkFBpTkibS",
                "9wcWEXmtUbmiAaWdhQ1nSaZ1cmDVdbYNbaeDcKoK5H8r",
                "CZFQJkE2uBqdwHH53kBT6UStyfcbCWzh6WHwRRtaLgrm",
                "ChkcdTKgyVsrLuD9zkUBoUkZ1GdZjTHEmgh5dhnR4haT",
            ]
        );
    }

    #[test]
    fn test_get_sol_domains_for_owner() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        for (owner, expected) in [
            (
                pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
                vec!["sns-ip-5-wallet-1", "sns-ip-5-wallet-2"],
            ),
            (
                pubkey!("96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr"),
                vec!["sns-ip-5-wallet-3"],
            ),
            (
                pubkey!("53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH"),
                Vec::<&str>::new(),
            ),
        ] {
            let mut domains = get_sol_domains_for_owner(&client, owner)
                .unwrap()
                .into_iter()
                .map(|domain| (domain.domain.clone(), domain.key))
                .collect::<Vec<_>>();
            domains.sort();
            let mut names = expected;
            names.sort_unstable();
            assert_eq!(
                domains
                    .iter()
                    .map(|(domain, _)| domain.as_str())
                    .collect::<Vec<_>>(),
                names
            );
            for (domain, key) in domains {
                assert_eq!(key, get_sol_domain_key(&domain).key);
            }
        }
    }
}
