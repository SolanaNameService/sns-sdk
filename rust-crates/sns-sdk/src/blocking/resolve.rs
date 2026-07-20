use {
    borsh::BorshDeserialize,
    name_tokenizer::state::NftRecord,
    solana_client::rpc_client::RpcClient,
    solana_program::{program_pack::Pack, pubkey::Pubkey},
    solana_sdk::account::Account,
    spl_name_service::state::{get_seeds_and_key, NameRecordHeader},
};

use crate::{
    blocking::nft::resolve_nft_owner,
    blocking::tld::assert_tld_supported,
    config::SOL_SRS_RESOLUTION_ENABLED,
    derivation::{
        get_hashed_name, get_sns_domain_key, get_srs_domain_key, NAME_TOKENIZER_ID,
        REVERSE_LOOKUP_CLASS,
    },
    error::SnsError,
    record::{
        get_record_key, record_v1::check_sol_record_v1_data, record_v2::check_sol_record_v2_data,
        Record, RecordVersion,
    },
    resolve::{
        current_unix_timestamp, get_srs_token_mint, parse_srs_record, parse_srs_token_holder,
        validate_srs_token_mint, SrsRecordOwner,
    },
    tld::SOL_TLD,
};

pub use crate::resolve::AllowPda;

/// Resolves a full `.sns` or `.sol` domain to its current owner.
pub fn resolve(
    rpc_client: &RpcClient,
    domain: &str,
    allow_pda: AllowPda,
) -> Result<Pubkey, SnsError> {
    resolve_with_config(
        rpc_client,
        domain,
        allow_pda,
        SOL_SRS_RESOLUTION_ENABLED,
        current_unix_timestamp(),
    )
}

/// Dispatches resolution with injected rollout state and time for deterministic tests.
pub(crate) fn resolve_with_config(
    rpc_client: &RpcClient,
    domain: &str,
    allow_pda: AllowPda,
    srs_resolution_enabled: bool,
    now_unix_seconds: i64,
) -> Result<Pubkey, SnsError> {
    if let Some(domain) = domain.strip_suffix(SOL_TLD) {
        if srs_resolution_enabled {
            return resolve_srs(rpc_client, domain, &allow_pda, now_unix_seconds);
        }
    }

    let (domain, _) = assert_tld_supported(rpc_client, domain)?;
    resolve_sns(rpc_client, domain, &allow_pda)
}

/// Resolves a TLD-trimmed name through SNS-IP 5 ownership priority.
fn resolve_sns(
    rpc_client: &RpcClient,
    domain: &str,
    allow_pda: &AllowPda,
) -> Result<Pubkey, SnsError> {
    let domain_key = get_sns_domain_key(domain)?.key;
    let nft_record_key = NftRecord::find_key(&domain_key, &NAME_TOKENIZER_ID).0;
    let sol_v1_key = get_record_key(domain, Record::Sol, RecordVersion::V1)?;
    let sol_v2_key = get_record_key(domain, Record::Sol, RecordVersion::V2)?;

    let accs =
        rpc_client.get_multiple_accounts(&[nft_record_key, sol_v1_key, sol_v2_key, domain_key])?;
    let nft_record_acc = accs.first().ok_or(SnsError::InvalidDomain)?.as_ref();
    let sol_v1_acc = accs.get(1).ok_or(SnsError::InvalidDomain)?.as_ref();
    let sol_v2_acc = accs.get(2).ok_or(SnsError::InvalidDomain)?.as_ref();
    let registry_acc = accs.get(3).ok_or(SnsError::InvalidDomain)?.as_ref();

    let registry = match registry_acc {
        Some(account) => deserialize_name_registry(account)?.0,
        None => return Err(SnsError::DomainDoesNotExist),
    };

    if let Some(account) = nft_record_acc {
        let nft_record = NftRecord::deserialize(&mut account.data.as_slice())?;
        if nft_record.is_active() {
            return resolve_nft_owner(rpc_client, &domain_key)?
                .ok_or(SnsError::CouldNotFindNftOwner);
        }
    }

    if let Some(acc) = sol_v2_acc {
        let record_data = acc
            .data
            .get(NameRecordHeader::LEN..)
            .ok_or(SnsError::InvalidRecordData)?;
        if let Some(owner) = check_sol_record_v2_data(record_data, &registry.owner)? {
            return Ok(owner);
        }
    }

    if let Some(acc) = sol_v1_acc {
        let record_data = acc
            .data
            .get(NameRecordHeader::LEN..)
            .ok_or(SnsError::InvalidRecordData)?;
        if let Some(owner) = check_sol_record_v1_data(record_data, &sol_v1_key, &registry.owner)? {
            return Ok(owner);
        }
    }

    resolve_owner_with_pda_policy(rpc_client, registry.owner, allow_pda)
}

/// Resolves a TLD-trimmed `.sol` name from its canonical SRS record.
fn resolve_srs(
    rpc_client: &RpcClient,
    domain: &str,
    allow_pda: &AllowPda,
    now_unix_seconds: i64,
) -> Result<Pubkey, SnsError> {
    let record_key = get_srs_domain_key(domain).key;
    let account = rpc_client
        .get_account_with_commitment(&record_key, rpc_client.commitment())?
        .value
        .ok_or(SnsError::DomainDoesNotExist)?;

    match parse_srs_record(&account.owner, &account.data, now_unix_seconds)? {
        SrsRecordOwner::Pubkey(owner) => {
            resolve_owner_with_pda_policy(rpc_client, owner, allow_pda)
        }
        SrsRecordOwner::Token(mint) => {
            resolve_srs_token_owner(rpc_client, &record_key, mint, allow_pda)
        }
    }
}

/// Resolves a tokenized SRS record through its unique Token-2022 holder.
fn resolve_srs_token_owner(
    rpc_client: &RpcClient,
    record: &Pubkey,
    mint: Pubkey,
    allow_pda: &AllowPda,
) -> Result<Pubkey, SnsError> {
    if mint != get_srs_token_mint(record) {
        return Err(SnsError::RecordMalformed);
    }

    let mint_account = rpc_client
        .get_account_with_commitment(&mint, rpc_client.commitment())?
        .value
        .ok_or(SnsError::CouldNotFindSrsOwner)?;
    validate_srs_token_mint(&mint_account)?;

    let mut unit_holders = rpc_client
        .get_token_largest_accounts(&mint)?
        .into_iter()
        .filter(|account| account.amount.amount == "1");
    let holder_key = unit_holders
        .next()
        .ok_or(SnsError::CouldNotFindSrsOwner)?
        .address
        .parse::<Pubkey>()
        .map_err(|_| SnsError::CouldNotFindSrsOwner)?;
    if unit_holders.next().is_some() {
        return Err(SnsError::CouldNotFindSrsOwner);
    }

    let holder_account = rpc_client
        .get_account_with_commitment(&holder_key, rpc_client.commitment())?
        .value
        .ok_or(SnsError::CouldNotFindSrsOwner)?;
    let owner = parse_srs_token_holder(&holder_account, &mint)?;
    resolve_owner_with_pda_policy(rpc_client, owner, allow_pda)
}

/// Applies the configured final-owner PDA policy.
fn resolve_owner_with_pda_policy(
    rpc_client: &RpcClient,
    owner: Pubkey,
    allow_pda: &AllowPda,
) -> Result<Pubkey, SnsError> {
    if owner.is_on_curve() {
        return Ok(owner);
    }
    match allow_pda {
        AllowPda::Deny => Err(SnsError::PdaOwnerNotAllowed),
        AllowPda::AllowAny => Ok(owner),
        AllowPda::Allow(allowed_programs) => {
            let owner_program = rpc_client
                .get_account_with_commitment(&owner, rpc_client.commitment())?
                .value
                .map(|acc| acc.owner);
            match owner_program {
                Some(p) if allowed_programs.contains(&p) => Ok(owner),
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
        Ok(Some(deserialize_name_registry(&acc)?))
    } else {
        Ok(None)
    }
}

pub fn resolve_name_registry_batch(
    rpc_client: &RpcClient,
    keys: &[Pubkey],
) -> Result<Vec<Option<(NameRecordHeader, Vec<u8>)>>, SnsError> {
    let mut res = vec![];
    for keys in keys.chunks(100) {
        let accs = rpc_client.get_multiple_accounts(keys)?;
        for acc in accs {
            if let Some(acc) = acc {
                res.push(Some(deserialize_name_registry(&acc)?));
            } else {
                res.push(None);
            }
        }
    }
    Ok(res)
}

pub(crate) fn deserialize_name_registry(
    account: &Account,
) -> Result<(NameRecordHeader, Vec<u8>), SnsError> {
    if account.owner != spl_name_service::ID {
        return Err(SnsError::InvalidNameAccountData);
    }
    let header_data = account
        .data
        .get(..NameRecordHeader::LEN)
        .ok_or(SnsError::InvalidNameAccountData)?;
    let payload = account
        .data
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

    resolve_name_registry_batch(rpc_client, &reverse_keys)?
        .into_iter()
        .map(|record| match record {
            Some((_, data)) => Ok(Some(deserialize_reverse(&data)?)),
            None => Ok(None),
        })
        .collect()
}

#[cfg(test)]
mod tests;
