use borsh::BorshDeserialize;
use name_tokenizer::state::NftRecord;
use solana_account_decoder::{UiAccountEncoding, UiDataSliceConfig};
use solana_client::{
    rpc_client::RpcClient,
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, RpcFilterType},
};
use solana_program::{program_pack::Pack, pubkey::Pubkey};
use spl_token::state::{Account, Mint};
use spl_token_2022::ID as SPL_TOKEN_2022_ID;

use super::rpc::get_multiple_accounts_batched;
use crate::{
    blocking::resolve::resolve_reverse_batch,
    derivation::{get_domain_mint, get_sol_domain_key, NAME_TOKENIZER_ID},
    error::SnsError,
    nft::{SnsNftDomain, SolNftDomain},
    resolve::{
        current_unix_timestamp, get_srs_token_mint, parse_sliced_token_2022_account_mint,
        parse_srs_nft_mint_name, parse_srs_record, sol_srs_group_pda, SrsRecordOwner,
        TOKEN_2022_ACCOUNT_DATA_SLICE,
    },
};

pub fn get_record_from_mint(
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

    let accounts = rpc_client.get_program_ui_accounts_with_config(&NAME_TOKENIZER_ID, config)?;
    Ok(accounts
        .into_iter()
        .filter_map(|(key, account)| account.to_account().map(|account| (key, account)))
        .collect())
}

pub fn get_nft_records(rpc_client: &RpcClient, owner: &Pubkey) -> Result<Vec<NftRecord>, SnsError> {
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
    let token_accounts = rpc_client
        .get_program_ui_accounts_with_config(&spl_token::ID, config)?
        .into_iter()
        .filter_map(|(_, acc)| {
            acc.to_account()
                .and_then(|acc| Account::unpack(&acc.data).ok())
        })
        .collect::<Vec<_>>();

    let records = token_accounts
        .iter()
        .filter_map(|acc| {
            let record = get_record_from_mint(rpc_client, &acc.mint).ok()?;
            let (_, account) = record.first()?;
            NftRecord::deserialize(&mut account.data.as_slice()).ok()
        })
        .collect::<Vec<_>>();

    Ok(records)
}

pub fn get_sns_nfts_for_owner(
    rpc_client: &RpcClient,
    owner: &Pubkey,
) -> Result<Vec<SnsNftDomain>, SnsError> {
    let records = get_nft_records(rpc_client, owner)?;
    let pubkeys = records.iter().map(|r| r.name_account).collect::<Vec<_>>();
    let reverses = resolve_reverse_batch(rpc_client, &pubkeys)?;

    let mut results = vec![];
    for (rev, record) in reverses.into_iter().zip(records) {
        if let Some(rev) = rev {
            results.push(SnsNftDomain {
                reverse: rev,
                key: record.name_account,
                mint: record.nft_mint,
            })
        }
    }
    Ok(results)
}

pub fn resolve_nft_owner(
    rpc_client: &RpcClient,
    domain_key: &Pubkey,
) -> Result<Option<Pubkey>, SnsError> {
    let mint_key = get_domain_mint(domain_key);
    let acc = rpc_client.get_multiple_accounts(&[mint_key])?;
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
    let res = rpc_client.get_program_ui_accounts_with_config(&spl_token::ID, config)?;

    if let Some((_, acc)) = res.first() {
        if let Some(acc) = acc.to_account() {
            return Ok(Some(
                spl_token::state::Account::unpack_unchecked(&acc.data)?.owner,
            ));
        }
    }

    Ok(None)
}

pub fn get_sol_nfts_for_owner(
    rpc_client: &RpcClient,
    owner: &Pubkey,
) -> Result<Vec<SolNftDomain>, SnsError> {
    let config = RpcProgramAccountsConfig {
        filters: Some(vec![
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(32, owner.to_bytes().to_vec())),
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(64, 1u64.to_le_bytes().to_vec())),
        ]),
        with_context: None,
        account_config: RpcAccountInfoConfig {
            encoding: Some(UiAccountEncoding::Base64),
            data_slice: Some(UiDataSliceConfig {
                offset: 0,
                length: TOKEN_2022_ACCOUNT_DATA_SLICE,
            }),
            ..Default::default()
        },
        sort_results: None,
    };
    let mints = rpc_client
        .get_program_ui_accounts_with_config(&SPL_TOKEN_2022_ID, config)?
        .into_iter()
        .filter_map(|(_, account)| {
            account
                .to_account()
                .and_then(|account| parse_sliced_token_2022_account_mint(&account.data))
        })
        .collect::<Vec<_>>();

    let mint_accounts = get_multiple_accounts_batched(rpc_client, &mints)?;
    let sol_group = sol_srs_group_pda();
    let mut candidates = Vec::new();
    for (mint, mint_account) in mints.into_iter().zip(mint_accounts) {
        let Some(mint_account) = mint_account else {
            continue;
        };
        let Some(name) = parse_srs_nft_mint_name(&mint_account, &mint, &sol_group) else {
            continue;
        };
        let key = get_sol_domain_key(&name).key;
        if get_srs_token_mint(&key) != mint {
            continue;
        }
        candidates.push(SolNftDomain {
            domain: name,
            key,
            mint,
        });
    }

    let record_keys = candidates.iter().map(|c| c.key).collect::<Vec<_>>();
    let record_accounts = get_multiple_accounts_batched(rpc_client, &record_keys)?;
    let now = current_unix_timestamp();
    let mut results = Vec::new();
    for (candidate, account) in candidates.into_iter().zip(record_accounts) {
        let Some(account) = account else { continue };
        let Ok(SrsRecordOwner::Token(record_mint)) =
            parse_srs_record(&account.owner, &account.data, now)
        else {
            continue;
        };
        if record_mint != candidate.mint {
            continue;
        }
        results.push(candidate);
    }
    Ok(results)
}

#[cfg(all(test, not(feature = "devnet")))]
mod tests {
    use super::*;
    use dotenv::dotenv;
    use solana_program::pubkey;

    const OWNER: Pubkey = pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    const EXPECTED_TOKENIZED_DOMAINS: [(&str, Pubkey, Pubkey); 2] = [
        (
            "wallet-guide-5",
            pubkey!("iSNVgWfb31aTWa58UxZ6fp7n3TTrUk5Gojggub5stXk"),
            pubkey!("2RJhBbxTiPT2bZq5bhjaTZbsnhbDB7VtTAMmCdBrwBZP"),
        ),
        (
            "wallet-guide-0",
            pubkey!("uDTBDfKrJSBTgmWUZLcENPk5YrHfWbcrUbNFLjsvNpn"),
            pubkey!("Eskv5Ns4gyREvNPPgANojNPsz6x1cbn9YwT7esAnxPhP"),
        ),
    ];

    #[test]
    fn test_get_sns_nfts_for_owner() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let mut domains = get_sns_nfts_for_owner(&client, &OWNER)
            .unwrap()
            .into_iter()
            .map(|domain| (domain.reverse, domain.key, domain.mint))
            .collect::<Vec<_>>();
        domains.sort_by(|a, b| b.0.cmp(&a.0));

        assert_eq!(
            domains,
            EXPECTED_TOKENIZED_DOMAINS
                .iter()
                .map(|(reverse, key, mint)| ((*reverse).to_string(), *key, *mint))
                .collect::<Vec<_>>()
        );
    }

    #[test]
    fn test_get_nft_records() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let mut records = get_nft_records(&client, &OWNER)
            .unwrap()
            .into_iter()
            .map(|record| (record.name_account, record.nft_mint))
            .collect::<Vec<_>>();
        records.sort();

        let mut expected = EXPECTED_TOKENIZED_DOMAINS
            .iter()
            .map(|(_, key, mint)| (*key, *mint))
            .collect::<Vec<_>>();
        expected.sort();

        assert_eq!(records, expected);
    }

    #[test]
    fn test_get_record_from_mint() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let records = get_record_from_mint(
            &client,
            &pubkey!("Eskv5Ns4gyREvNPPgANojNPsz6x1cbn9YwT7esAnxPhP"),
        )
        .unwrap();

        assert_eq!(records.len(), 1);
        let nft_record = NftRecord::deserialize(&mut records[0].1.data.as_slice()).unwrap();
        assert_eq!(nft_record.name_account, EXPECTED_TOKENIZED_DOMAINS[1].1);
        assert_eq!(nft_record.nft_mint, EXPECTED_TOKENIZED_DOMAINS[1].2);
    }

    #[test]
    fn test_resolve_nft_owner() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let owner = resolve_nft_owner(
            &client,
            &pubkey!("iSNVgWfb31aTWa58UxZ6fp7n3TTrUk5Gojggub5stXk"),
        )
        .unwrap();

        assert_eq!(owner, Some(OWNER));
    }

    #[test]
    fn test_get_sol_nfts_for_owner() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        for (owner, expected) in [
            (
                pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
                Vec::<&str>::new(),
            ),
            (
                pubkey!("96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr"),
                vec!["sns-ip-5-wallet-5"],
            ),
            (
                pubkey!("53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH"),
                vec!["sns-ip-5-wallet-7", "sns-ip-5-wallet-9"],
            ),
        ] {
            let nfts = get_sol_nfts_for_owner(&client, &owner).unwrap();
            let mut names = nfts.iter().map(|n| n.domain.as_str()).collect::<Vec<_>>();
            names.sort_unstable();
            let mut expected = expected;
            expected.sort_unstable();
            assert_eq!(names, expected);
            for nft in &nfts {
                assert_eq!(nft.mint, get_srs_token_mint(&nft.key));
            }
        }
    }
}
