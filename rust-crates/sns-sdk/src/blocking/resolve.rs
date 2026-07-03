use {
    solana_client::rpc_client::RpcClient,
    solana_program::{program_pack::Pack, pubkey::Pubkey},
    spl_name_service::state::{get_seeds_and_key, NameRecordHeader},
};

use crate::{
    blocking::nft::resolve_nft_owner,
    derivation::{get_domain_key, get_hashed_name, REVERSE_LOOKUP_CLASS},
    error::SnsError,
    record::{
        get_record_key, record_v1::check_sol_record_v1_data, record_v2::check_sol_record_v2_data,
        Record, RecordVersion,
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

pub fn resolve(
    rpc_client: &RpcClient,
    domain: &str,
    allow_pda: AllowPda,
) -> Result<Option<Pubkey>, SnsError> {
    let domain_key = get_domain_key(domain)?;
    let sol_v1_key = get_record_key(domain, Record::Sol, RecordVersion::V1)?;
    let sol_v2_key = get_record_key(domain, Record::Sol, RecordVersion::V2)?;

    let accs = rpc_client.get_multiple_accounts(&[domain_key, sol_v1_key, sol_v2_key])?;
    let registry_acc = accs.first().ok_or(SnsError::InvalidDomain)?.as_ref();
    let sol_v1_acc = accs.get(1).ok_or(SnsError::InvalidDomain)?.as_ref();
    let sol_v2_acc = accs.get(2).ok_or(SnsError::InvalidDomain)?.as_ref();

    let registry = match registry_acc {
        Some(a) => deserialize_name_registry(&a.data)?.0,
        None => return Ok(None),
    };

    if let Some(nft_owner) = resolve_nft_owner(rpc_client, &domain_key)? {
        return Ok(Some(nft_owner));
    }

    if let Some(acc) = sol_v2_acc {
        let record_data = acc
            .data
            .get(NameRecordHeader::LEN..)
            .ok_or(SnsError::InvalidRecordData)?;
        if let Some(owner) = check_sol_record_v2_data(record_data, &registry.owner)? {
            return Ok(Some(owner));
        }
    }

    if let Some(acc) = sol_v1_acc {
        let record_data = acc
            .data
            .get(NameRecordHeader::LEN..)
            .ok_or(SnsError::InvalidRecordData)?;
        if let Some(owner) = check_sol_record_v1_data(record_data, &sol_v1_key, &registry.owner)? {
            return Ok(Some(owner));
        }
    }

    if registry.owner.is_on_curve() {
        return Ok(Some(registry.owner));
    }
    match allow_pda {
        AllowPda::Deny => Err(SnsError::PdaOwnerNotAllowed),
        AllowPda::AllowAny => Ok(Some(registry.owner)),
        AllowPda::Allow(allowed_programs) => {
            let owner_program = rpc_client
                .get_account_with_commitment(&registry.owner, rpc_client.commitment())?
                .value
                .map(|acc| acc.owner);
            match owner_program {
                Some(p) if allowed_programs.contains(&p) => Ok(Some(registry.owner)),
                _ => Err(SnsError::PdaOwnerNotAllowed),
            }
        }
    }
}

pub fn resolve_name_registry(
    rpc_client: &RpcClient,
    key: &Pubkey,
) -> Result<Option<(NameRecordHeader, Vec<u8>)>, SnsError> {
    let acc = rpc_client
        .get_account_with_commitment(key, rpc_client.commitment())?
        .value;
    if let Some(acc) = acc {
        Ok(Some(deserialize_name_registry(&acc.data)?))
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

pub fn resolve_reverse(rpc_client: &RpcClient, key: &Pubkey) -> Result<Option<String>, SnsError> {
    let hashed = get_hashed_name(&key.to_string());
    let (key, _) = get_seeds_and_key(
        &spl_name_service::ID,
        hashed,
        Some(&REVERSE_LOOKUP_CLASS),
        None,
    );
    if let Some((_, data)) = resolve_name_registry(rpc_client, &key)? {
        Ok(Some(deserialize_reverse(&data)?))
    } else {
        Ok(None)
    }
}

pub fn resolve_reverse_batch(
    rpc_client: &RpcClient,
    keys: &[Pubkey],
) -> Result<Vec<Option<String>>, SnsError> {
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

    let mut res = vec![];
    for keys in reverse_keys.chunks(100) {
        let accs = rpc_client.get_multiple_accounts(keys)?;
        for acc in accs {
            if let Some(acc) = acc {
                let data = acc.data[NameRecordHeader::LEN..].to_vec();
                res.push(Some(deserialize_reverse(&data)?))
            } else {
                res.push(None)
            }
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

    #[test]
    fn test_reverse() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let key: Pubkey = pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb");
        let reverse = resolve_reverse(&client, &key).unwrap();
        assert_eq!(reverse.unwrap(), "bonfida");
    }

    #[test]
    fn test_resolve() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        let res = resolve(&client, "🇺🇸.sns", AllowPda::Deny).unwrap();
        assert_eq!(
            res.unwrap(),
            pubkey!("8fe1EFcmz4BYeX6zGp6HUdoaHjVYhzsv599ub52WJbos")
        );

        let res = resolve(&client, "0xluna.sns", AllowPda::Deny).unwrap();
        assert_eq!(
            res.unwrap(),
            pubkey!("8fe1EFcmz4BYeX6zGp6HUdoaHjVYhzsv599ub52WJbos")
        );

        let res = resolve(&client, "bonfida.sns", AllowPda::Deny).unwrap();
        assert_eq!(
            res.unwrap(),
            pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v")
        );

        let res = resolve(
            &client,
            &format!("{}.sns", generate_random_string(20)),
            AllowPda::Deny,
        )
        .unwrap();
        assert_eq!(res, None);

        let res = resolve(&RpcClient::new(""), "bonfida.sns", AllowPda::Deny);
        assert!(res.is_err())
    }

    #[test]
    fn resolve_sns_ip_5() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        let cases = [
            (
                "sns-ip-5-wallet-1",
                pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
            ),
            (
                "sns-ip-5-wallet-2",
                pubkey!("AxwzQXhZNJb9zLyiHUQA12L2GL7CxvUNrp6neee6r3cA"),
            ),
            (
                "sns-ip-5-wallet-4",
                pubkey!("7PLHHJawDoa4PGJUK3mUnusV7SEVwZwEyV5csVzm86J4"),
            ),
            (
                "sns-ip-5-wallet-7",
                pubkey!("53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH"),
            ),
            (
                "sns-ip-5-wallet-8",
                pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
            ),
            (
                "sns-ip-5-wallet-9",
                pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
            ),
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
                let res = resolve(&client, &domain, AllowPda::Deny).unwrap();
                assert_eq!(res, Some(expected), "domain {domain}");
            }
        }
    }

    #[test]
    fn resolve_sns_ip_5_pda_allowed() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let expected = pubkey!("96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr");
        let system_program = solana_program::system_program::ID;

        for tld in ["sns", "sol"] {
            for domain in ["sns-ip-5-wallet-5", "sns-ip-5-wallet-10"] {
                let domain = format!("{domain}.{tld}");
                let res = resolve(&client, &domain, AllowPda::Allow(vec![system_program])).unwrap();
                assert_eq!(res, Some(expected), "domain {domain} with Allow");

                let res = resolve(&client, &domain, AllowPda::AllowAny).unwrap();
                assert_eq!(res, Some(expected), "domain {domain} with AllowAny");
            }
        }
    }

    #[test]
    fn resolve_sns_ip_5_errors() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        for tld in ["sns", "sol"] {
            let domain = format!("sns-ip-5-wallet-3.{tld}");
            let res = resolve(&client, &domain, AllowPda::Deny);
            assert!(
                matches!(res, Err(SnsError::WrongValidation)),
                "{domain}: {res:?}"
            );

            let domain = format!("sns-ip-5-wallet-12.{tld}");
            let res = resolve(&client, &domain, AllowPda::Deny);
            assert!(
                matches!(res, Err(SnsError::WrongValidation)),
                "{domain}: {res:?}"
            );

            let domain = format!("sns-ip-5-wallet-6.{tld}");
            let res = resolve(&client, &domain, AllowPda::Deny);
            assert!(
                matches!(res, Err(SnsError::PdaOwnerNotAllowed)),
                "{domain}: {res:?}"
            );

            let domain = format!("sns-ip-5-wallet-11.{tld}");
            let res = resolve(&client, &domain, AllowPda::Deny);
            assert!(
                matches!(res, Err(SnsError::PdaOwnerNotAllowed)),
                "{domain}: {res:?}"
            );
        }

        let res = resolve(&client, "sns-ip-5-wallet-6.sns", AllowPda::Allow(vec![]));
        assert!(matches!(res, Err(SnsError::PdaOwnerNotAllowed)), "{res:?}");
    }
}
