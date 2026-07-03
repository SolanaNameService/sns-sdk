use {
    borsh::BorshDeserialize,
    name_tokenizer::state::NftRecord,
    solana_account_decoder::UiAccountEncoding,
    solana_client::{
        nonblocking::rpc_client::RpcClient,
        rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
        rpc_filter::{Memcmp, RpcFilterType},
    },
    solana_program::{program_pack::Pack, pubkey::Pubkey},
    spl_name_service::state::{get_seeds_and_key, NameRecordHeader},
    spl_token::state::Account,
    spl_token::state::Mint,
};

use sns_records::state::validation::Validation;

use crate::{
    derivation::{
        get_domain_key, get_domain_mint, get_hashed_name, NAME_TOKENIZER_ID, REVERSE_LOOKUP_CLASS,
        ROOT_DOMAIN_ACCOUNT,
    },
    error::SnsError,
    primary_domain::{derive_primary_domain_key, PrimaryDomain},
    record::{
        get_record_key, record_v1::check_sol_record, record_v2::parse_raw_record_v2, Record,
        RecordVersion,
    },
};

/// Caller policy for the SNS-IP 5 registry-owner fallback when the owner is a PDA.
///
/// Only consulted when none of the override branches (tokenized / V2 SOL / V1 SOL)
/// resolve and the final fallback would be the registry owner.
#[derive(Debug, Clone)]
pub enum AllowPda {
    /// Throw `PdaOwnerNotAllowed` if the registry owner is a PDA.
    Deny,
    /// Allow the PDA if its owning program is in this list; otherwise throw.
    Allow(Vec<Pubkey>),
    /// Return the PDA unconditionally. Discouraged.
    AllowAny,
}

pub async fn resolve_owner(
    rpc_client: &RpcClient,
    domain: &str,
    allow_pda: AllowPda,
) -> Result<Option<Pubkey>, SnsError> {
    let domain_key = get_domain_key(domain)?;
    let sol_v1_key = get_record_key(domain, Record::Sol, RecordVersion::V1)?;
    let sol_v2_key = get_record_key(domain, Record::Sol, RecordVersion::V2)?;

    // Single round-trip for registry + both SOL record candidates. Each slot is
    // `None` when the corresponding account doesn't exist on chain.
    let accs = rpc_client
        .get_multiple_accounts(&[domain_key, sol_v1_key, sol_v2_key])
        .await?;
    let registry_acc = accs.first().ok_or(SnsError::InvalidDomain)?.as_ref();
    let sol_v1_acc = accs.get(1).ok_or(SnsError::InvalidDomain)?.as_ref();
    let sol_v2_acc = accs.get(2).ok_or(SnsError::InvalidDomain)?.as_ref();

    // No registry account = domain was never registered.
    let registry = match registry_acc {
        Some(a) => deserialize_name_registry(&a.data)?.0,
        None => return Ok(None),
    };

    // SNS-IP 5 step 1: tokenized domain -> NFT holder wins, skip the record chain.
    if let Some(nft_owner) = resolve_nft_owner(rpc_client, &domain_key).await? {
        return Ok(Some(nft_owner));
    }

    // SNS-IP 5 step 2: V2 SOL record. `Ok(None)` means stale -> fall through to V1.
    if let Some(acc) = sol_v2_acc {
        if let Some(owner) = check_sol_record_v2_data(&acc.data, &registry.owner)? {
            return Ok(Some(owner));
        }
    }

    // SNS-IP 5 step 3: V1 SOL record. `Ok(None)` means bad signature -> fall through.
    if let Some(acc) = sol_v1_acc {
        if let Some(owner) = check_sol_record_v1_data(&acc.data, &sol_v1_key, &registry.owner)? {
            return Ok(Some(owner));
        }
    }

    // SNS-IP 5 step 4: no override survived -> registry owner is the resolved owner.
    // §4.2 PDA gate: if the registry owner is a PDA, the caller must opt in.
    if registry.owner.is_on_curve() {
        return Ok(Some(registry.owner));
    }
    match allow_pda {
        AllowPda::Deny => Err(SnsError::PdaOwnerNotAllowed),
        AllowPda::AllowAny => Ok(Some(registry.owner)),
        AllowPda::Allow(allowed_programs) => {
            let owner_program = rpc_client
                .get_account_with_commitment(&registry.owner, rpc_client.commitment())
                .await?
                .value
                .map(|acc| acc.owner);
            match owner_program {
                Some(p) if allowed_programs.contains(&p) => Ok(Some(registry.owner)),
                _ => Err(SnsError::PdaOwnerNotAllowed),
            }
        }
    }
}

/// Validate a V2 SOL record against the current registry owner and return the destination pubkey.
///
/// - `Ok(Some(_))` – record is fresh, RoA matches content
/// - `Ok(None)` – record is stale (staleness id != current registry owner) → caller should fall through
/// - `Err(RecordMalformed)` – content length != 32
/// - `Err(WrongValidation)` – either validation field != Solana
/// - `Err(InvalidRoa)` – RoA id != content
fn check_sol_record_v2_data(
    account_data: &[u8],
    registry_owner: &Pubkey,
) -> Result<Option<Pubkey>, SnsError> {
    let record = parse_raw_record_v2(account_data)?;

    // SOL record stores exactly one Solana pubkey (32B). Anything else = malformed.
    if record.content.len() != 32 {
        return Err(SnsError::RecordMalformed);
    }

    // SNS-IP 5 requires both proofs to be Solana Ed25519 signatures. Other variants
    // (None / Ethereum / UnverifiedSolana / XChain) cannot authorize SOL resolution.
    if !matches!(record.staleness_validation, Validation::Solana)
        || !matches!(record.roa_validation, Validation::Solana)
    {
        return Err(SnsError::WrongValidation);
    }

    // Staleness: the pubkey baked into the record must equal the *current* registry
    // owner. If the domain has been transferred since the record was signed, the
    // record is stale - return `None` so the caller falls through to V1 / registry.
    if record.staleness_id != registry_owner.as_ref() {
        return Ok(None);
    }

    // Right-of-Association: the destination address must have signed off on
    // receiving funds for this domain. The on-chain program stores `roa_id` only
    // after a valid signature, so `roa_id == content` proves consent.
    if record.roa_id == record.content {
        let bytes: [u8; 32] = record
            .content
            .try_into()
            .map_err(|_| SnsError::InvalidPubkey)?;
        return Ok(Some(Pubkey::new_from_array(bytes)));
    }

    // Record is fresh but RoA doesn't match content -> can't safely resolve.
    Err(SnsError::InvalidRoa)
}

fn check_sol_record_v1_data(
    account_data: &[u8],
    record_key: &Pubkey,
    registry_owner: &Pubkey,
) -> Result<Option<Pubkey>, SnsError> {
    // V1 payload after the SPL header = 32B destination pubkey + 64B Ed25519 signature.
    let payload = account_data
        .get(NameRecordHeader::LEN..NameRecordHeader::LEN + 96)
        .ok_or(SnsError::InvalidRecordData)?;
    // Signer signed hex(destination || record_key) -- rebuild the same bytes to verify.
    let record = [&payload[..32], &record_key.to_bytes()].concat();
    let sig = &payload[32..];
    let encoded = hex::encode(record);
    // Signature must verify against the *current* registry owner; the destination is
    // only trusted because that owner explicitly signed off on it.
    if check_sol_record(encoded.as_bytes(), sig, *registry_owner)? {
        let bytes: [u8; 32] = payload[0..32]
            .try_into()
            .map_err(|_| SnsError::InvalidPubkey)?;
        return Ok(Some(Pubkey::new_from_array(bytes)));
    }
    Ok(None)
}

/// Resolve only the V1 SOL record for `domain`, validating the signature against `owner`.
///
/// Returns `Ok(Some(_))` if the record exists and the signature is valid for `owner`,
/// `Ok(None)` if the record is missing or the signature does not verify. Errors are
/// reserved for RPC / decoding failures.
pub async fn resolve_sol_record_v1(
    rpc_client: &RpcClient,
    owner: &Pubkey,
    domain: &str,
) -> Result<Option<Pubkey>, SnsError> {
    let record_key = get_record_key(domain, Record::Sol, RecordVersion::V1)?;
    let mut accs = rpc_client.get_multiple_accounts(&[record_key]).await?;
    match accs.swap_remove(0) {
        Some(acc) => check_sol_record_v1_data(&acc.data, &record_key, owner),
        None => Ok(None),
    }
}

/// Resolve only the V2 SOL record for `domain`, validating staleness + RoA against `owner`.
///
/// Returns `Ok(Some(_))` if the record is fresh and the RoA matches the content,
/// `Ok(None)` if the record is missing or stale. `RecordMalformed`/`WrongValidation`/
/// `InvalidRoa` errors propagate when the record exists but is structurally invalid.
pub async fn resolve_sol_record_v2(
    rpc_client: &RpcClient,
    owner: &Pubkey,
    domain: &str,
) -> Result<Option<Pubkey>, SnsError> {
    let record_key = get_record_key(domain, Record::Sol, RecordVersion::V2)?;
    let mut accs = rpc_client.get_multiple_accounts(&[record_key]).await?;
    match accs.swap_remove(0) {
        Some(acc) => check_sol_record_v2_data(&acc.data, owner),
        None => Ok(None),
    }
}

pub async fn resolve_record(
    rpc_client: &RpcClient,
    domain: &str,
    record: Record,
) -> Result<Option<(NameRecordHeader, Vec<u8>)>, SnsError> {
    let key = get_record_key(domain, record, crate::record::RecordVersion::V1)?;
    let res = resolve_name_registry(rpc_client, &key).await?;
    if let Some(res) = res {
        Ok(Some(res))
    } else {
        Ok(None)
    }
}

pub fn deserialize_name_registry(data: &[u8]) -> Result<(NameRecordHeader, Vec<u8>), SnsError> {
    let header = NameRecordHeader::unpack_unchecked(&data[0..NameRecordHeader::LEN])?;
    let data = data[NameRecordHeader::LEN..].to_vec();
    Ok((header, data))
}

pub fn deserialize_reverse(data: &[u8]) -> Result<String, SnsError> {
    let len = u32::from_le_bytes(data[0..4].try_into().unwrap());
    let reverse =
        String::from_utf8(data[4..4 + len as usize].to_vec()).or(Err(SnsError::InvalidReverse))?;
    Ok(reverse)
}

pub async fn resolve_name_registry(
    rpc_client: &RpcClient,
    key: &Pubkey,
) -> Result<Option<(NameRecordHeader, Vec<u8>)>, SnsError> {
    let acc = rpc_client
        .get_account_with_commitment(key, rpc_client.commitment())
        .await?
        .value;
    if let Some(acc) = acc {
        Ok(Some(deserialize_name_registry(&acc.data)?))
    } else {
        Ok(None)
    }
}

pub async fn resolve_name_registry_batch(
    rpc_client: &RpcClient,
    keys: &[Pubkey],
) -> Result<Vec<Option<(NameRecordHeader, Vec<u8>)>>, SnsError> {
    let mut res = vec![];
    for k in keys.chunks(100) {
        let accs = rpc_client.get_multiple_accounts(k).await?;
        for acc in accs {
            if let Some(acc) = acc {
                let des = deserialize_name_registry(&acc.data)?;
                res.push(Some(des))
            } else {
                res.push(None)
            }
        }
    }
    Ok(res)
}

pub async fn resolve_reverse(
    rpc_client: &RpcClient,
    key: &Pubkey,
) -> Result<Option<String>, SnsError> {
    let hashed = get_hashed_name(&key.to_string());
    let (key, _) = get_seeds_and_key(
        &spl_name_service::ID,
        hashed,
        Some(&REVERSE_LOOKUP_CLASS),
        None,
    );
    if let Some((_, data)) = resolve_name_registry(rpc_client, &key).await? {
        Ok(Some(deserialize_reverse(&data)?))
    } else {
        Ok(None)
    }
}

pub async fn resolve_reverse_batch(
    rpc_client: &RpcClient,
    keys: &[Pubkey],
) -> Result<Vec<Option<String>>, SnsError> {
    let mut res = vec![];

    let reverse_keys = keys
        .iter()
        .map(|k| {
            let hashed = get_hashed_name(&k.to_string());
            let (key, _) = get_seeds_and_key(
                &spl_name_service::ID,
                hashed,
                Some(&REVERSE_LOOKUP_CLASS),
                None,
            );
            key
        })
        .collect::<Vec<_>>();

    let reverses = resolve_name_registry_batch(rpc_client, &reverse_keys).await?;
    for r in reverses {
        if let Some((_, data)) = r {
            let des = deserialize_reverse(&data)?;
            res.push(Some(des))
        } else {
            res.push(None)
        }
    }

    Ok(res)
}

pub async fn get_domains_owner(
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
            ..Default::default()
        },
        sort_results: None,
    };
    let res = rpc_client
        .get_program_accounts_with_config(&spl_name_service::ID, config.clone())
        .await?;
    let keys = res.into_iter().map(|x| x.0).collect::<Vec<_>>();
    Ok(keys)
}

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

    let res = rpc_client
        .get_program_accounts_with_config(&NAME_TOKENIZER_ID, config.clone())
        .await?;

    Ok(res)
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
        .get_program_accounts_with_config(&spl_token::ID, config.clone())
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

    let records = futures::future::join_all(futures)
        .await
        .into_iter()
        .filter(Result::is_ok)
        .map(Result::unwrap)
        .collect::<Vec<_>>();

    Ok(records)
}

pub async fn get_tokenized_domains(
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
        .get_program_accounts_with_config(&spl_name_service::ID, config.clone())
        .await?;

    let res = res
        .into_iter()
        .map(|(_, acc)| {
            let mut offset = NameRecordHeader::LEN;
            let len = u32::from_le_bytes(acc.data[offset..offset + 4].try_into().unwrap());
            offset += 4;

            String::from_utf8(acc.data[offset..offset + len as usize].to_vec()).unwrap()
        })
        .map(|x| x.strip_prefix('\0').unwrap().to_owned())
        .collect::<Vec<_>>();

    Ok(res)
}

pub async fn resolve_nft_owner(
    rpc_client: &RpcClient,
    domain_key: &Pubkey,
) -> Result<Option<Pubkey>, SnsError> {
    let mint_key = get_domain_mint(domain_key);
    let acc = rpc_client.get_multiple_accounts(&[mint_key]).await?;
    let acc = acc.first().ok_or(SnsError::InvalidDomain)?;
    if acc.is_none() {
        return Ok(None);
    }
    let mint = Mint::unpack(&acc.as_ref().unwrap().data)?;
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
        .get_program_accounts_with_config(&spl_token::ID, config.clone())
        .await?;

    if let Some((_, acc)) = res.first() {
        return Ok(Some(
            spl_token::state::Account::unpack_unchecked(&acc.data)?.owner,
        ));
    }

    Ok(None)
}

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
        let parsed = PrimaryDomain::parse(&a.data)?;
        Ok(Some(parsed.name_account))
    } else {
        Ok(None)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::derivation::get_domain_key;
    use crate::record::record_v1::deserialize_record;
    use crate::record::Record;
    use crate::utils::test::generate_random_string;
    use dotenv::dotenv;
    use solana_program::pubkey;
    use solana_sdk::signature::Keypair;
    use solana_sdk::signer::Signer;

    #[tokio::test]
    async fn reverse() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let key: Pubkey = pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb");
        let reverse = resolve_reverse(&client, &key).await.unwrap();
        assert_eq!(reverse.unwrap(), "bonfida");

        let reverse = resolve_reverse(&client, &Keypair::new().pubkey()).await;
        assert!(reverse.unwrap().is_none());
    }

    #[tokio::test]
    async fn subs() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let parent: Pubkey = get_domain_key("bonfida.sol").unwrap();
        let mut reverse = get_subdomains(&client, &parent).await.unwrap();
        reverse.sort();
        assert_eq!(reverse, vec!["dex", "naming", "test"]);
    }

    #[tokio::test]
    async fn resolve() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        // `🇺🇸`: V1 signature no longer verifies after registry-owner rotation, so the
        // current registry owner is returned.
        let res = resolve_owner(&client, "🇺🇸.sns", AllowPda::Deny)
            .await
            .unwrap();
        assert_eq!(
            res.unwrap(),
            pubkey!("8fe1EFcmz4BYeX6zGp6HUdoaHjVYhzsv599ub52WJbos")
        );

        let res = resolve_owner(&client, "0xluna.sns", AllowPda::Deny)
            .await
            .unwrap();
        assert_eq!(
            res.unwrap(),
            pubkey!("8fe1EFcmz4BYeX6zGp6HUdoaHjVYhzsv599ub52WJbos")
        );

        let res = resolve_owner(&client, "bonfida.sns", AllowPda::Deny)
            .await
            .unwrap();
        assert_eq!(
            res.unwrap(),
            pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v")
        );

        // Domain does not exist
        let res = resolve_owner(
            &client,
            &format!("{}.sns", generate_random_string(20)),
            AllowPda::Deny,
        )
        .await
        .unwrap();
        assert_eq!(res, None);
    }

    #[tokio::test]
    async fn resolve_sns_ip_5() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        let cases = [
            // wallet-1: tokenized -> NFT owner.
            (
                "sns-ip-5-wallet-1.sns",
                pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
            ),
            // wallet-2: V2 fresh + valid RoA -> record content.
            (
                "sns-ip-5-wallet-2.sns",
                pubkey!("AxwzQXhZNJb9zLyiHUQA12L2GL7CxvUNrp6neee6r3cA"),
            ),
            // wallet-4: V2 stale, no V1, registry owner not a PDA -> registry owner.
            (
                "sns-ip-5-wallet-4.sns",
                pubkey!("7PLHHJawDoa4PGJUK3mUnusV7SEVwZwEyV5csVzm86J4"),
            ),
            // wallet-7: no V2, V1 valid -> record content.
            (
                "sns-ip-5-wallet-7.sns",
                pubkey!("53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH"),
            ),
            // wallet-8: no V2, V1 invalid signature -> registry owner.
            (
                "sns-ip-5-wallet-8.sns",
                pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
            ),
            // wallet-9: no V2, no V1, registry owner not a PDA -> registry owner.
            (
                "sns-ip-5-wallet-9.sns",
                pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
            ),
            // V2 SOL backward-compat fixtures.
            (
                "wallet-guide-6.sns",
                pubkey!("Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ"),
            ),
            (
                "wallet-guide-8.sns",
                pubkey!("36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"),
            ),
        ];

        for (domain, expected) in cases {
            let res = resolve_owner(&client, domain, AllowPda::Deny)
                .await
                .unwrap();
            assert_eq!(res, Some(expected), "domain {domain}");
        }
    }

    /// SNS-IP 5 §4.2 PDA gate: wallet-5 (V2 stale + PDA owner) and wallet-10 (no V1
    /// + PDA owner). Both should resolve to the registry owner when the caller
    /// explicitly allows the program owning the PDA.
    #[tokio::test]
    async fn resolve_sns_ip_5_pda_allowed() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let expected = pubkey!("96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr");
        let system_program = solana_program::system_program::ID;

        for domain in ["sns-ip-5-wallet-5.sns", "sns-ip-5-wallet-10.sns"] {
            let res = resolve_owner(&client, domain, AllowPda::Allow(vec![system_program]))
                .await
                .unwrap();
            assert_eq!(res, Some(expected), "domain {domain} with Allow");

            let res = resolve_owner(&client, domain, AllowPda::AllowAny)
                .await
                .unwrap();
            assert_eq!(res, Some(expected), "domain {domain} with AllowAny");
        }
    }

    #[tokio::test]
    async fn resolve_sns_ip_5_errors() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        // wallet-3: V2 fresh, on-chain record uses non-Solana validations.
        let res = resolve_owner(&client, "sns-ip-5-wallet-3.sns", AllowPda::Deny).await;
        assert!(matches!(res, Err(SnsError::WrongValidation)), "{res:?}");

        // wallet-12: on-chain `right_of_association_validation = UnverifiedSolana` (the
        // state `write_roa` leaves behind before `validate_solana_signature` runs), so
        // the validation check short-circuits before any RoA comparison runs.
        let res = resolve_owner(&client, "sns-ip-5-wallet-12.sns", AllowPda::Deny).await;
        assert!(matches!(res, Err(SnsError::WrongValidation)), "{res:?}");

        // wallet-6: V2 stale + PDA owner + Deny -> PdaOwnerNotAllowed.
        let res = resolve_owner(&client, "sns-ip-5-wallet-6.sns", AllowPda::Deny).await;
        assert!(matches!(res, Err(SnsError::PdaOwnerNotAllowed)), "{res:?}");

        // wallet-11: no V2, no V1, PDA owner + Deny -> PdaOwnerNotAllowed.
        let res = resolve_owner(&client, "sns-ip-5-wallet-11.sns", AllowPda::Deny).await;
        assert!(matches!(res, Err(SnsError::PdaOwnerNotAllowed)), "{res:?}");

        // wallet-6 with an empty allow-list still throws (program not in list).
        let res = resolve_owner(&client, "sns-ip-5-wallet-6.sns", AllowPda::Allow(vec![])).await;
        assert!(matches!(res, Err(SnsError::PdaOwnerNotAllowed)), "{res:?}");
    }

    #[tokio::test]
    async fn test_resolve_sol_record_v2_standalone() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        // wallet-2 is set up with a fresh V2 SOL record pointing to a distinct address.
        let domain = "sns-ip-5-wallet-2.sns";
        let domain_key = get_domain_key(domain).unwrap();
        let (header, _) = resolve_name_registry(&client, &domain_key)
            .await
            .unwrap()
            .unwrap();
        let res = resolve_sol_record_v2(&client, &header.owner, domain)
            .await
            .unwrap();
        assert_eq!(
            res,
            Some(pubkey!("AxwzQXhZNJb9zLyiHUQA12L2GL7CxvUNrp6neee6r3cA"))
        );

        // Missing V2 record returns Ok(None).
        let res = resolve_sol_record_v2(&client, &header.owner, "bonfida.sns")
            .await
            .unwrap();
        assert_eq!(res, None);
    }

    #[tokio::test]
    async fn test_resolve_sol_record_v1_standalone() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        // wallet-guide-4 carries a fresh V1 SOL record signed by its current registry owner.
        let domain = "wallet-guide-4.sol";
        let domain_key = get_domain_key(domain).unwrap();
        let (header, _) = resolve_name_registry(&client, &domain_key)
            .await
            .unwrap()
            .unwrap();
        let res = resolve_sol_record_v1(&client, &header.owner, domain)
            .await
            .unwrap();
        assert_eq!(
            res,
            Some(pubkey!("Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ"))
        );

        // Missing V1 record returns Ok(None).
        let res = resolve_sol_record_v1(
            &client,
            &header.owner,
            &format!("{}.sns", generate_random_string(20)),
        )
        .await
        .unwrap();
        assert_eq!(res, None);
    }

    #[tokio::test]
    async fn batch_resolve_reverses() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let reverses = resolve_reverse_batch(
            &client,
            &[
                pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"),
                pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"),
            ],
        )
        .await
        .unwrap();
        assert_eq!(
            reverses,
            vec![Some("bonfida".to_string()), Some("bonfida".to_string())]
        )
    }

    #[tokio::test]
    async fn test_resolve_record() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        let res = resolve_record(&client, "bonfida.sns", Record::Url)
            .await
            .unwrap();
        assert_eq!(
            deserialize_record(&res.unwrap().1, Record::Url, &Pubkey::default()).unwrap(),
            "https://sns.id"
        );

        let res = resolve_record(&client, "bonfida.sns", Record::Backpack)
            .await
            .unwrap();
        assert!(res.is_none());

        let res = resolve_record(&client, "🍍.sns", Record::Eth)
            .await
            .unwrap();
        assert_eq!(
            deserialize_record(&res.unwrap().1, Record::Eth, &Pubkey::default()).unwrap(),
            "0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6"
        );
    }

    #[tokio::test]
    async fn test_resolve_registry() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let key = get_domain_key(&format!("{}.sns", generate_random_string(20))).unwrap();
        let res = resolve_name_registry(&client, &key).await;
        assert!(res.unwrap().is_none());

        let key = get_domain_key("bonfida.sns").unwrap();
        let res = resolve_name_registry(&client, &key).await;
        assert!(res.unwrap().is_some())
    }

    #[tokio::test]
    async fn test_get_primary_domain() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let domain = get_primary_domain(
            &client,
            &pubkey!("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA"),
        )
        .await
        .unwrap();
        assert_eq!(
            &domain.unwrap().to_string(),
            "Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"
        );
    }

    #[tokio::test]
    async fn test_get_tokenized_domains() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let owner = pubkey!("J6QDztZCegYTWnGUYtjqVS9d7AZoS43UbEQmMcdGeP5s");
        let domains = get_tokenized_domains(&client, &owner).await.unwrap();
        println!("{domains:?}");
    }
}
