use {
    solana_client::nonblocking::rpc_client::RpcClient,
    solana_program::{program_pack::Pack, pubkey::Pubkey},
    spl_name_service::state::{get_seeds_and_key, NameRecordHeader},
};

use crate::{
    derivation::{get_hashed_name, get_sns_domain_key, REVERSE_LOOKUP_CLASS},
    error::SnsError,
    non_blocking::nft::resolve_nft_owner,
    record::{
        get_record_key, record_v1::check_sol_record_v1_data, record_v2::check_sol_record_v2_data,
        Record, RecordVersion,
    },
    tld::parse_supported_tld,
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

pub async fn resolve(
    rpc_client: &RpcClient,
    domain: &str,
    allow_pda: AllowPda,
) -> Result<Option<Pubkey>, SnsError> {
    let (domain, _) = parse_supported_tld(domain)?;
    let domain_key = get_sns_domain_key(domain)?.key;
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
        let record_data = acc
            .data
            .get(NameRecordHeader::LEN..)
            .ok_or(SnsError::InvalidRecordData)?;
        if let Some(owner) = check_sol_record_v2_data(record_data, &registry.owner)? {
            return Ok(Some(owner));
        }
    }

    // SNS-IP 5 step 3: V1 SOL record. `Ok(None)` means bad signature -> fall through.
    if let Some(acc) = sol_v1_acc {
        let record_data = acc
            .data
            .get(NameRecordHeader::LEN..)
            .ok_or(SnsError::InvalidRecordData)?;
        if let Some(owner) = check_sol_record_v1_data(record_data, &sol_v1_key, &registry.owner)? {
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

pub(crate) fn deserialize_name_registry(
    data: &[u8],
) -> Result<(NameRecordHeader, Vec<u8>), SnsError> {
    let header_data = data
        .get(..NameRecordHeader::LEN)
        .ok_or(SnsError::InvalidNameAccountData)?;
    let payload = data
        .get(NameRecordHeader::LEN..)
        .ok_or(SnsError::InvalidNameAccountData)?;
    let header = NameRecordHeader::unpack_unchecked(header_data)?;
    Ok((header, payload.to_vec()))
}

pub(crate) fn deserialize_reverse(data: &[u8]) -> Result<String, SnsError> {
    let len_data = data.get(..4).ok_or(SnsError::InvalidReverse)?;
    let len = u32::from_le_bytes(len_data.try_into().map_err(|_| SnsError::InvalidReverse)?);
    let reverse_data = data
        .get(4..4 + len as usize)
        .ok_or(SnsError::InvalidReverse)?;
    String::from_utf8(reverse_data.to_vec()).map_err(|_| SnsError::InvalidReverse)
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

#[cfg(test)]
mod tests {
    use super::*;
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
    async fn test_resolve() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        // `🇺🇸`: V1 signature no longer verifies after registry-owner rotation, so the
        // current registry owner is returned.
        let res = resolve(&client, "🇺🇸.sns", AllowPda::Deny).await.unwrap();
        assert_eq!(
            res.unwrap(),
            pubkey!("8fe1EFcmz4BYeX6zGp6HUdoaHjVYhzsv599ub52WJbos")
        );

        let res = resolve(&client, "0xluna.sns", AllowPda::Deny)
            .await
            .unwrap();
        assert_eq!(
            res.unwrap(),
            pubkey!("8fe1EFcmz4BYeX6zGp6HUdoaHjVYhzsv599ub52WJbos")
        );

        let res = resolve(&client, "bonfida.sns", AllowPda::Deny)
            .await
            .unwrap();
        assert_eq!(
            res.unwrap(),
            pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v")
        );

        // Domain does not exist
        let res = resolve(
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
                "sns-ip-5-wallet-1",
                pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
            ),
            // wallet-2: V2 fresh + valid RoA -> record content.
            (
                "sns-ip-5-wallet-2",
                pubkey!("AxwzQXhZNJb9zLyiHUQA12L2GL7CxvUNrp6neee6r3cA"),
            ),
            // wallet-4: V2 stale, no V1, registry owner not a PDA -> registry owner.
            (
                "sns-ip-5-wallet-4",
                pubkey!("7PLHHJawDoa4PGJUK3mUnusV7SEVwZwEyV5csVzm86J4"),
            ),
            // wallet-7: no V2, V1 valid -> record content.
            (
                "sns-ip-5-wallet-7",
                pubkey!("53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH"),
            ),
            // wallet-8: no V2, V1 invalid signature -> registry owner.
            (
                "sns-ip-5-wallet-8",
                pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
            ),
            // wallet-9: no V2, no V1, registry owner not a PDA -> registry owner.
            (
                "sns-ip-5-wallet-9",
                pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
            ),
            // V2 SOL backward-compat fixtures.
            (
                "wallet-guide-5",
                pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
            ),
            (
                "wallet-guide-4",
                pubkey!("Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ"),
            ),
            (
                "wallet-guide-3",
                pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
            ),
            (
                "wallet-guide-2",
                pubkey!("36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"),
            ),
            (
                "wallet-guide-1",
                pubkey!("36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"),
            ),
            (
                "wallet-guide-0",
                pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
            ),
            (
                "sub-0.wallet-guide-3",
                pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
            ),
            (
                "sub-1.wallet-guide-3",
                pubkey!("Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ"),
            ),
            (
                "wallet-guide-6",
                pubkey!("Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ"),
            ),
            (
                "wallet-guide-8",
                pubkey!("36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"),
            ),
        ];

        for tld in ["sns", "sol"] {
            for (domain, expected) in cases {
                let domain = format!("{domain}.{tld}");
                let res = resolve(&client, &domain, AllowPda::Deny).await.unwrap();
                assert_eq!(res, Some(expected), "domain {domain}");
            }
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

        for tld in ["sns", "sol"] {
            for domain in ["sns-ip-5-wallet-5", "sns-ip-5-wallet-10"] {
                let domain = format!("{domain}.{tld}");
                let res = resolve(&client, &domain, AllowPda::Allow(vec![system_program]))
                    .await
                    .unwrap();
                assert_eq!(res, Some(expected), "domain {domain} with Allow");

                let res = resolve(&client, &domain, AllowPda::AllowAny).await.unwrap();
                assert_eq!(res, Some(expected), "domain {domain} with AllowAny");
            }
        }
    }

    #[tokio::test]
    async fn resolve_sns_ip_5_errors() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        for tld in ["sns", "sol"] {
            let domain = format!("sns-ip-5-wallet-3.{tld}");
            let res = resolve(&client, &domain, AllowPda::Deny).await;
            assert!(
                matches!(res, Err(SnsError::WrongValidation)),
                "{domain}: {res:?}"
            );

            let domain = format!("sns-ip-5-wallet-12.{tld}");
            let res = resolve(&client, &domain, AllowPda::Deny).await;
            assert!(
                matches!(res, Err(SnsError::WrongValidation)),
                "{domain}: {res:?}"
            );

            let domain = format!("sns-ip-5-wallet-6.{tld}");
            let res = resolve(&client, &domain, AllowPda::Deny).await;
            assert!(
                matches!(res, Err(SnsError::PdaOwnerNotAllowed)),
                "{domain}: {res:?}"
            );

            let domain = format!("sns-ip-5-wallet-11.{tld}");
            let res = resolve(&client, &domain, AllowPda::Deny).await;
            assert!(
                matches!(res, Err(SnsError::PdaOwnerNotAllowed)),
                "{domain}: {res:?}"
            );
        }

        // wallet-6 with an empty allow-list still throws (program not in list).
        let res = resolve(&client, "sns-ip-5-wallet-6.sns", AllowPda::Allow(vec![])).await;
        assert!(matches!(res, Err(SnsError::PdaOwnerNotAllowed)), "{res:?}");
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
    async fn test_resolve_registry() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let key = get_sns_domain_key(&generate_random_string(20)).unwrap().key;
        let res = resolve_name_registry(&client, &key).await;
        assert!(res.unwrap().is_none());

        let key = get_sns_domain_key("bonfida").unwrap().key;
        let res = resolve_name_registry(&client, &key).await;
        assert!(res.unwrap().is_some())
    }
}
