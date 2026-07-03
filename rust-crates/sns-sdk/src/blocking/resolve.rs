use {
    solana_client::{
        client_error::{ClientError, ClientErrorKind},
        rpc_client::RpcClient,
        rpc_request::RpcError::RpcRequestError,
    },
    solana_program::{program_pack::Pack, pubkey::Pubkey},
    spl_name_service::state::{get_seeds_and_key, NameRecordHeader},
};

use crate::{
    blocking::nft::resolve_nft_owner,
    derivation::{get_domain_key, get_hashed_name, REVERSE_LOOKUP_CLASS},
    error::SnsError,
    record::{get_record_key, record_v1::check_sol_record, Record},
};

pub fn resolve_owner(rpc_client: &RpcClient, domain: &str) -> Result<Option<Pubkey>, SnsError> {
    let key = get_domain_key(domain)?;

    let header = match resolve_name_registry(rpc_client, &key)? {
        Some((h, _)) => h,
        _ => return Ok(None),
    };

    let nft_owner = resolve_nft_owner(rpc_client, &key)?;

    if let Some(nft_owner) = nft_owner {
        return Ok(Some(nft_owner));
    }

    let sol_record_key = get_record_key(domain, Record::Sol, crate::record::RecordVersion::V1)?;
    match resolve_name_registry(rpc_client, &sol_record_key) {
        Ok(Some((_, data))) => {
            let data = &data[..96];
            let record = [&data[..32], &sol_record_key.to_bytes()].concat();
            let sig = &data[32..];
            let encoded = hex::encode(record);
            if check_sol_record(encoded.as_bytes(), sig, header.owner)? {
                let owner = Pubkey::new_from_array(
                    data[0..32]
                        .try_into()
                        .map_err(|_| SnsError::InvalidPubkey)?,
                );
                return Ok(Some(owner));
            }
        }
        Err(SnsError::SolanaClient(ClientError {
            request: None,
            kind: ClientErrorKind::RpcError(RpcRequestError(err)),
        })) => {
            return Err(SnsError::SolanaClient(ClientError {
                request: None,
                kind: ClientErrorKind::RpcError(RpcRequestError(err)),
            }))
        }
        _ => {}
    }

    Ok(Some(header.owner))
}

pub fn resolve_name_registry(
    rpc_client: &RpcClient,
    key: &Pubkey,
) -> Result<Option<(NameRecordHeader, Vec<u8>)>, SnsError> {
    let acc = rpc_client
        .get_account_with_commitment(key, rpc_client.commitment())?
        .value;
    if let Some(acc) = acc {
        let header = NameRecordHeader::unpack_unchecked(&acc.data[0..NameRecordHeader::LEN])?;
        let data = acc.data[NameRecordHeader::LEN..].to_vec();
        Ok(Some((header, data)))
    } else {
        Ok(None)
    }
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
        let len = u32::from_le_bytes(data[0..4].try_into().unwrap());
        let reverse = String::from_utf8(data[4..4 + len as usize].to_vec())
            .or(Err(SnsError::InvalidReverse))?;
        Ok(Some(reverse))
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
                let len = u32::from_le_bytes(data[0..4].try_into().unwrap());
                let reverse = String::from_utf8(data[4..4 + len as usize].to_vec())
                    .or(Err(SnsError::InvalidReverse))?;
                res.push(Some(reverse))
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
    fn test_resolve_owner() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        // SOL record
        let res = resolve_owner(&client, "🇺🇸").unwrap();
        assert_eq!(
            res.unwrap(),
            pubkey!("CnNHzcp7L4jKiA2Rsca3hZyVwSmoqXaT8wGwzS8WvvB2")
        );

        // Tokenized
        let res = resolve_owner(&client, "0xluna").unwrap();
        assert_eq!(
            res.unwrap(),
            pubkey!("CnNHzcp7L4jKiA2Rsca3hZyVwSmoqXaT8wGwzS8WvvB2")
        );

        // Normal case
        let res = resolve_owner(&client, "bonfida").unwrap();
        assert_eq!(
            res.unwrap(),
            pubkey!("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA")
        );

        // Domain does not exist
        let res = resolve_owner(&client, &generate_random_string(20)).unwrap();
        assert_eq!(res, None);

        // Error
        let res = resolve_owner(&RpcClient::new(""), "bonfida");
        assert!(res.is_err())
    }
}
