use borsh::BorshDeserialize;
use name_tokenizer::state::NftRecord;
use solana_account_decoder::UiAccountEncoding;
use solana_client::{
    nonblocking::rpc_client::RpcClient,
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, RpcFilterType},
};
use solana_program::{program_pack::Pack, pubkey::Pubkey};
use spl_token::state::{Account, Mint};

use crate::{
    derivation::{get_domain_mint, NAME_TOKENIZER_ID},
    error::SnsError,
    non_blocking::resolve::resolve_reverse_batch,
};

pub async fn get_record_from_mint(
    rpc_client: &RpcClient,
    mint: &Pubkey,
) -> Result<Vec<(Pubkey, solana_sdk::account::Account)>, SnsError> {
    let config = RpcProgramAccountsConfig {
        filters: Some(vec![
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(
                0,
                vec![name_tokenizer::state::Tag::ActiveRecord as u8],
            )),
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(66, mint.to_bytes().to_vec())),
        ]),
        with_context: None,
        account_config: RpcAccountInfoConfig {
            encoding: Some(UiAccountEncoding::Base64),
            ..Default::default()
        },
        sort_results: None,
    };

    Ok(rpc_client
        .get_program_accounts_with_config(&NAME_TOKENIZER_ID, config)
        .await?)
}

pub async fn get_nft_records(
    rpc_client: &RpcClient,
    owner: &Pubkey,
) -> Result<Vec<NftRecord>, SnsError> {
    let config = RpcProgramAccountsConfig {
        filters: Some(vec![
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(32, owner.to_bytes().to_vec())),
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(64, 1u64.to_le_bytes().to_vec())),
            RpcFilterType::DataSize(165),
        ]),
        with_context: None,
        account_config: RpcAccountInfoConfig {
            encoding: Some(UiAccountEncoding::Base64),
            ..Default::default()
        },
        sort_results: None,
    };
    let res = rpc_client
        .get_program_accounts_with_config(&spl_token::ID, config)
        .await?
        .into_iter()
        .map(|(_, acc)| Account::unpack(&acc.data))
        .filter(Result::is_ok)
        .map(Result::unwrap)
        .collect::<Vec<_>>();

    async fn closure(rpc_client: &RpcClient, acc: &Account) -> Result<NftRecord, SnsError> {
        let record = get_record_from_mint(rpc_client, &acc.mint).await?;
        if let Some((_, acc)) = record.first() {
            let des = NftRecord::deserialize(&mut acc.data.as_slice())?;
            return Ok(des);
        }
        Err(SnsError::NftRecordDoesNotExist)
    }

    let futures = res.iter().map(|acc| closure(rpc_client, acc));

    Ok(futures::future::join_all(futures)
        .await
        .into_iter()
        .filter(Result::is_ok)
        .map(Result::unwrap)
        .collect::<Vec<_>>())
}

pub async fn get_sns_nfts_for_owner(
    rpc_client: &RpcClient,
    owner: &Pubkey,
) -> Result<Vec<(String, Pubkey)>, SnsError> {
    let pubkeys = get_nft_records(rpc_client, owner)
        .await?
        .into_iter()
        .map(|r| r.name_account)
        .collect::<Vec<_>>();

    let reverses = resolve_reverse_batch(rpc_client, &pubkeys).await?;

    let mut results = vec![];
    for (rev, key) in reverses.into_iter().zip(pubkeys) {
        if let Some(rev) = rev {
            results.push((rev, key))
        }
    }
    Ok(results)
}

pub async fn resolve_nft_owner(
    rpc_client: &RpcClient,
    domain_key: &Pubkey,
) -> Result<Option<Pubkey>, SnsError> {
    let mint_key = get_domain_mint(domain_key);
    let acc = rpc_client.get_multiple_accounts(&[mint_key]).await?;
    let acc = acc.first().ok_or(SnsError::InvalidDomain)?;
    let Some(acc) = acc.as_ref() else {
        return Ok(None);
    };
    let mint = Mint::unpack(&acc.data)?;
    if mint.supply != 1 {
        return Ok(None);
    }

    let config = RpcProgramAccountsConfig {
        filters: Some(vec![
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(0, mint_key.to_bytes().to_vec())),
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(64, vec![1])),
            RpcFilterType::DataSize(165),
        ]),
        with_context: None,
        account_config: RpcAccountInfoConfig {
            encoding: Some(UiAccountEncoding::Base64),
            ..Default::default()
        },
        sort_results: None,
    };
    let res = rpc_client
        .get_program_accounts_with_config(&spl_token::ID, config)
        .await?;

    if let Some((_, acc)) = res.first() {
        return Ok(Some(
            spl_token::state::Account::unpack_unchecked(&acc.data)?.owner,
        ));
    }

    Ok(None)
}

#[cfg(test)]
mod tests {
    use super::*;
    use dotenv::dotenv;
    use solana_program::pubkey;

    const OWNER: Pubkey = pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");

    fn expected_tokenized_domains() -> Vec<(String, String, String)> {
        vec![
            (
                "wallet-guide-5".to_string(),
                "iSNVgWfb31aTWa58UxZ6fp7n3TTrUk5Gojggub5stXk".to_string(),
                "2RJhBbxTiPT2bZq5bhjaTZbsnhbDB7VtTAMmCdBrwBZP".to_string(),
            ),
            (
                "wallet-guide-0".to_string(),
                "uDTBDfKrJSBTgmWUZLcENPk5YrHfWbcrUbNFLjsvNpn".to_string(),
                "Eskv5Ns4gyREvNPPgANojNPsz6x1cbn9YwT7esAnxPhP".to_string(),
            ),
        ]
    }

    #[tokio::test]
    async fn test_get_sns_nfts_for_owner() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let mut domains = get_sns_nfts_for_owner(&client, &OWNER)
            .await
            .unwrap()
            .into_iter()
            .map(|(reverse, key)| (reverse, key.to_string()))
            .collect::<Vec<_>>();
        domains.sort_by(|a, b| b.0.cmp(&a.0));

        assert_eq!(
            domains,
            expected_tokenized_domains()
                .into_iter()
                .map(|(reverse, key, _)| (reverse, key))
                .collect::<Vec<_>>()
        );
    }

    #[tokio::test]
    async fn test_get_nft_records() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let mut records = get_nft_records(&client, &OWNER)
            .await
            .unwrap()
            .into_iter()
            .map(|record| (record.name_account.to_string(), record.nft_mint.to_string()))
            .collect::<Vec<_>>();
        records.sort();

        let mut expected = expected_tokenized_domains()
            .into_iter()
            .map(|(_, key, mint)| (key, mint))
            .collect::<Vec<_>>();
        expected.sort();

        assert_eq!(records, expected);
    }

    #[tokio::test]
    async fn test_get_record_from_mint() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let records = get_record_from_mint(
            &client,
            &pubkey!("Eskv5Ns4gyREvNPPgANojNPsz6x1cbn9YwT7esAnxPhP"),
        )
        .await
        .unwrap();

        assert_eq!(records.len(), 1);
        let nft_record = NftRecord::deserialize(&mut records[0].1.data.as_slice()).unwrap();
        assert_eq!(
            nft_record.name_account.to_string(),
            "uDTBDfKrJSBTgmWUZLcENPk5YrHfWbcrUbNFLjsvNpn"
        );
        assert_eq!(
            nft_record.nft_mint.to_string(),
            "Eskv5Ns4gyREvNPPgANojNPsz6x1cbn9YwT7esAnxPhP"
        );
    }

    #[tokio::test]
    async fn test_resolve_nft_owner() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let owner = resolve_nft_owner(
            &client,
            &pubkey!("iSNVgWfb31aTWa58UxZ6fp7n3TTrUk5Gojggub5stXk"),
        )
        .await
        .unwrap();

        assert_eq!(owner, Some(OWNER));
    }
}
