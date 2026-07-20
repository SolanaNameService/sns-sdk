use solana_account_decoder::{UiAccountEncoding, UiDataSliceConfig};
use solana_client::{
    nonblocking::rpc_client::RpcClient,
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, RpcFilterType},
};
use solana_program::pubkey::Pubkey;

use crate::{derivation::ROOT_DOMAIN_ACCOUNT, error::SnsError};

pub async fn get_sns_domains_for_owner(
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
    let res = rpc_client
        .get_program_accounts_with_config(&spl_name_service::ID, config)
        .await?;
    Ok(res.into_iter().map(|x| x.0).collect())
}

#[cfg(all(test, not(feature = "devnet")))]
mod tests {
    use super::*;
    use dotenv::dotenv;
    use solana_program::pubkey;

    #[tokio::test]
    async fn test_get_sns_domains_for_owner() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let mut domains = get_sns_domains_for_owner(
            &client,
            pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
        )
        .await
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
}
