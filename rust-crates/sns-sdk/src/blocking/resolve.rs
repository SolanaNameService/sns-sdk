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
mod tests {
    use super::*;
    use crate::{
        config::SOL_TLD_CUTOFF_SLOT,
        derivation::{get_domain_mint, get_sns_domain_key, get_srs_domain_key, SRS_PROGRAM_ID},
        resolve::{
            get_srs_token_mint, srs_record_data, token_2022_holder_account,
            token_2022_mint_account, SrsRecordOwner,
        },
        utils::test::{
            account_response, multiple_accounts_response, token_largest_accounts_response,
            TestRpcSender,
        },
    };
    use borsh::BorshSerialize;
    #[cfg(not(feature = "devnet"))]
    use dotenv::dotenv;
    use serde_json::{json, Value};
    use solana_client::{rpc_client::RpcClientConfig, rpc_request::RpcRequest};
    use solana_program::pubkey;
    use solana_sdk::account::Account;
    use spl_token_2022::state::AccountState;

    const TEST_NOW: i64 = 1_000;

    fn test_client(
        endpoint: &str,
        responses: impl IntoIterator<Item = (RpcRequest, Value)>,
    ) -> (RpcClient, TestRpcSender) {
        let sender = responses.into_iter().fold(
            TestRpcSender::new(endpoint, json!(0)),
            |sender, (request, response)| sender.with_response(request, response),
        );
        let client = RpcClient::new_sender(
            sender.clone(),
            RpcClientConfig::with_commitment(Default::default()),
        );
        (client, sender)
    }

    fn srs_account(owner: SrsRecordOwner) -> Account {
        Account {
            lamports: 1,
            data: srs_record_data(owner, TEST_NOW + 1),
            owner: SRS_PROGRAM_ID,
            executable: false,
            rent_epoch: 0,
        }
    }

    fn registry_account(owner: Pubkey) -> Account {
        let header = NameRecordHeader {
            parent_name: Pubkey::default(),
            owner,
            class: Pubkey::default(),
        };
        let mut data = vec![0; NameRecordHeader::LEN];
        NameRecordHeader::pack(header, &mut data).unwrap();
        Account {
            data,
            owner: spl_name_service::ID,
            ..Account::default()
        }
    }

    fn active_nft_record_account(domain_key: Pubkey, mint_key: Pubkey) -> Account {
        let record = NftRecord::new(0, Pubkey::new_unique(), domain_key, mint_key);
        let mut data = Vec::new();
        record.serialize(&mut data).unwrap();
        Account {
            data,
            owner: NAME_TOKENIZER_ID,
            ..Account::default()
        }
    }

    fn token_srs_test_client(
        endpoint: &str,
        domain: &str,
        balances: &[(Pubkey, &str)],
        holder_account: Option<&Account>,
        owner_account: Option<&Account>,
    ) -> (RpcClient, TestRpcSender) {
        let record_key = get_srs_domain_key(domain).key;
        let mint = get_srs_token_mint(&record_key);
        let record = srs_account(SrsRecordOwner::Token(mint));
        let mint_account = token_2022_mint_account(1, 0, true);
        let mut responses = vec![
            (RpcRequest::GetAccountInfo, account_response(Some(&record))),
            (
                RpcRequest::GetAccountInfo,
                account_response(Some(&mint_account)),
            ),
            (
                RpcRequest::GetTokenLargestAccounts,
                token_largest_accounts_response(balances),
            ),
        ];
        if let Some(holder_account) = holder_account {
            responses.push((
                RpcRequest::GetAccountInfo,
                account_response(Some(holder_account)),
            ));
        }
        if let Some(owner_account) = owner_account {
            responses.push((
                RpcRequest::GetAccountInfo,
                account_response(Some(owner_account)),
            ));
        }
        test_client(endpoint, responses)
    }

    // Resolver routing

    #[test]
    fn sns_resolves_via_sns_regardless_of_srs_setting() {
        let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
        let registry = registry_account(owner);

        for srs_enabled in [false, true] {
            let (client, sender) = test_client(
                &format!("blocking-sns-routing-{srs_enabled}"),
                [(
                    RpcRequest::GetMultipleAccounts,
                    multiple_accounts_response(&[None, None, None, Some(&registry)]),
                )],
            );
            assert_eq!(
                resolve_with_config(&client, "domain.sns", AllowPda::Deny, srs_enabled, TEST_NOW,)
                    .unwrap(),
                owner
            );
            assert_eq!(
                sender
                    .requests()
                    .iter()
                    .map(|(request, _)| *request)
                    .collect::<Vec<_>>(),
                vec![RpcRequest::GetMultipleAccounts]
            );
        }
    }

    /// Enabled `.sol` resolution requests only the canonical SRS record.
    #[test]
    fn sol_resolves_via_srs_when_srs_is_enabled() {
        let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
        let account = srs_account(SrsRecordOwner::Pubkey(owner));
        let (client, sender) = test_client(
            "blocking-srs-direct",
            [(RpcRequest::GetAccountInfo, account_response(Some(&account)))],
        );
        assert_eq!(
            resolve_with_config(&client, "bonfida.sol", AllowPda::Deny, true, TEST_NOW).unwrap(),
            owner
        );
        assert_eq!(
            sender
                .requests()
                .iter()
                .map(|(request, _)| *request)
                .collect::<Vec<_>>(),
            vec![RpcRequest::GetAccountInfo]
        );
    }

    #[test]
    fn sol_resolves_via_sns_before_cutoff_when_srs_is_disabled() {
        let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
        let registry = registry_account(owner);
        let (client, sender) = test_client(
            "blocking-sns-sol-before-cutoff",
            [(
                RpcRequest::GetMultipleAccounts,
                multiple_accounts_response(&[None, None, None, Some(&registry)]),
            )],
        );
        assert_eq!(
            resolve_with_config(&client, "domain.sol", AllowPda::Deny, false, TEST_NOW).unwrap(),
            owner
        );
        assert_eq!(
            sender
                .requests()
                .iter()
                .map(|(request, _)| *request)
                .collect::<Vec<_>>(),
            vec![RpcRequest::GetSlot, RpcRequest::GetMultipleAccounts]
        );
    }

    #[test]
    fn sol_is_not_resolved_after_cutoff_when_srs_is_disabled() {
        let (client, sender) = test_client(
            "blocking-sns-sol-after-cutoff",
            [(RpcRequest::GetSlot, json!(SOL_TLD_CUTOFF_SLOT + 1))],
        );
        assert!(matches!(
            resolve_with_config(&client, "domain.sol", AllowPda::Deny, false, TEST_NOW),
            Err(SnsError::UnsupportedTld)
        ));
        assert_eq!(
            sender
                .requests()
                .iter()
                .map(|(request, _)| *request)
                .collect::<Vec<_>>(),
            vec![RpcRequest::GetSlot]
        );
    }

    #[test]
    fn rejects_unsupported_tld() {
        let (client, sender) = test_client("blocking-srs-unsupported", []);
        assert!(matches!(
            resolve_with_config(&client, "future.eth", AllowPda::Deny, true, TEST_NOW),
            Err(SnsError::UnsupportedTld)
        ));
        assert!(sender.requests().is_empty());
    }

    // SRS owner handling

    #[test]
    fn rejects_missing_srs_record() {
        let (client, sender) = test_client("blocking-srs-missing", []);
        assert!(matches!(
            resolve_with_config(&client, "missing.sol", AllowPda::Deny, true, TEST_NOW),
            Err(SnsError::DomainDoesNotExist)
        ));
        assert_eq!(sender.requests()[0].0, RpcRequest::GetAccountInfo);
    }

    #[test]
    fn rejects_noncanonical_srs_token_mint() {
        let account = srs_account(SrsRecordOwner::Token(Pubkey::new_unique()));
        let (client, sender) = test_client(
            "blocking-srs-token",
            [(RpcRequest::GetAccountInfo, account_response(Some(&account)))],
        );
        assert!(matches!(
            resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW),
            Err(SnsError::RecordMalformed)
        ));
        assert_eq!(sender.requests().len(), 1);
    }

    #[test]
    fn resolves_initialized_and_frozen_srs_token_holders() {
        let domain = "token";
        let record_key = get_srs_domain_key(domain).key;
        let mint = get_srs_token_mint(&record_key);
        let holder_key = Pubkey::new_unique();
        let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");

        for state in [AccountState::Initialized, AccountState::Frozen] {
            let holder = token_2022_holder_account(mint, owner, 1, state);
            let (client, _) = token_srs_test_client(
                &format!("blocking-token-holder-{state:?}"),
                domain,
                &[(holder_key, "1"), (Pubkey::new_unique(), "0")],
                Some(&holder),
                None,
            );
            assert_eq!(
                resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW,).unwrap(),
                owner
            );
        }
    }

    #[test]
    fn rejects_missing_srs_token_mint() {
        let domain = "token";
        let record_key = get_srs_domain_key(domain).key;
        let mint = get_srs_token_mint(&record_key);
        let record = srs_account(SrsRecordOwner::Token(mint));
        let (client, _) = test_client(
            "blocking-token-missing-mint",
            [(RpcRequest::GetAccountInfo, account_response(Some(&record)))],
        );
        assert!(matches!(
            resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW),
            Err(SnsError::CouldNotFindSrsOwner)
        ));
    }

    #[test]
    fn rejects_zero_or_multiple_srs_token_holders() {
        for (endpoint, balances) in [
            ("blocking-token-no-holder", vec![]),
            (
                "blocking-token-multiple-holders",
                vec![(Pubkey::new_unique(), "1"), (Pubkey::new_unique(), "1")],
            ),
        ] {
            let (client, _) = token_srs_test_client(endpoint, "token", &balances, None, None);
            assert!(matches!(
                resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW),
                Err(SnsError::CouldNotFindSrsOwner)
            ));
        }
    }

    #[test]
    fn rejects_missing_srs_token_holder() {
        let (client, _) = token_srs_test_client(
            "blocking-token-missing-holder-account",
            "token",
            &[(Pubkey::new_unique(), "1")],
            None,
            None,
        );
        assert!(matches!(
            resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW),
            Err(SnsError::CouldNotFindSrsOwner)
        ));
    }

    #[test]
    fn applies_pda_policy_to_srs_token_holder() {
        let domain = "token";
        let mint = get_srs_token_mint(&get_srs_domain_key(domain).key);
        let holder_key = Pubkey::new_unique();
        let owner = Pubkey::find_program_address(&[b"token-holder"], &SRS_PROGRAM_ID).0;
        let holder = token_2022_holder_account(mint, owner, 1, AccountState::Initialized);

        let (client, _) = token_srs_test_client(
            "blocking-token-pda-deny",
            domain,
            &[(holder_key, "1")],
            Some(&holder),
            None,
        );
        assert!(matches!(
            resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW),
            Err(SnsError::PdaOwnerNotAllowed)
        ));

        let (client, _) = token_srs_test_client(
            "blocking-token-pda-any",
            domain,
            &[(holder_key, "1")],
            Some(&holder),
            None,
        );
        assert_eq!(
            resolve_with_config(&client, "token.sol", AllowPda::AllowAny, true, TEST_NOW).unwrap(),
            owner
        );

        let allowed_program = Pubkey::new_unique();
        let owner_account = Account {
            owner: allowed_program,
            ..Account::default()
        };
        let (client, _) = token_srs_test_client(
            "blocking-token-pda-allowlisted",
            domain,
            &[(holder_key, "1")],
            Some(&holder),
            Some(&owner_account),
        );
        assert_eq!(
            resolve_with_config(
                &client,
                "token.sol",
                AllowPda::Allow(vec![allowed_program]),
                true,
                TEST_NOW,
            )
            .unwrap(),
            owner
        );
    }

    #[test]
    fn propagates_srs_token_holder_lookup_errors() {
        let domain = "token";
        let record_key = get_srs_domain_key(domain).key;
        let mint = get_srs_token_mint(&record_key);
        let record = srs_account(SrsRecordOwner::Token(mint));
        let mint_account = token_2022_mint_account(1, 0, true);
        let sender = TestRpcSender::new("blocking-token-largest-error", json!(0))
            .with_response(RpcRequest::GetAccountInfo, account_response(Some(&record)))
            .with_response(
                RpcRequest::GetAccountInfo,
                account_response(Some(&mint_account)),
            )
            .with_error(RpcRequest::GetTokenLargestAccounts, "RPC unavailable");
        let client =
            RpcClient::new_sender(sender, RpcClientConfig::with_commitment(Default::default()));
        let error =
            resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW).unwrap_err();
        assert!(matches!(
            error,
            SnsError::SolanaClient(error)
                if matches!(&error.kind, solana_client::client_error::ClientErrorKind::Custom(message) if message == "RPC unavailable")
        ));
    }

    #[test]
    fn applies_pda_policy_to_direct_srs_owner() {
        let owner = Pubkey::find_program_address(&[b"owner"], &SRS_PROGRAM_ID).0;
        let record = srs_account(SrsRecordOwner::Pubkey(owner));

        let (client, _) = test_client(
            "blocking-srs-pda-deny",
            [(RpcRequest::GetAccountInfo, account_response(Some(&record)))],
        );
        assert!(matches!(
            resolve_with_config(&client, "pda.sol", AllowPda::Deny, true, TEST_NOW),
            Err(SnsError::PdaOwnerNotAllowed)
        ));

        let (client, _) = test_client(
            "blocking-srs-pda-any",
            [(RpcRequest::GetAccountInfo, account_response(Some(&record)))],
        );
        assert_eq!(
            resolve_with_config(&client, "pda.sol", AllowPda::AllowAny, true, TEST_NOW).unwrap(),
            owner
        );

        let allowed_program = Pubkey::new_unique();
        let owner_account = Account {
            owner: allowed_program,
            ..Account::default()
        };
        let (client, _) = test_client(
            "blocking-srs-pda-allowed",
            [
                (RpcRequest::GetAccountInfo, account_response(Some(&record))),
                (
                    RpcRequest::GetAccountInfo,
                    account_response(Some(&owner_account)),
                ),
            ],
        );
        assert_eq!(
            resolve_with_config(
                &client,
                "pda.sol",
                AllowPda::Allow(vec![allowed_program]),
                true,
                TEST_NOW,
            )
            .unwrap(),
            owner
        );

        let (client, _) = test_client(
            "blocking-srs-pda-not-allowed",
            [
                (RpcRequest::GetAccountInfo, account_response(Some(&record))),
                (
                    RpcRequest::GetAccountInfo,
                    account_response(Some(&owner_account)),
                ),
            ],
        );
        assert!(matches!(
            resolve_with_config(
                &client,
                "pda.sol",
                AllowPda::Allow(vec![Pubkey::new_unique()]),
                true,
                TEST_NOW,
            ),
            Err(SnsError::PdaOwnerNotAllowed)
        ));

        let (client, _) = test_client(
            "blocking-srs-pda-missing",
            [
                (RpcRequest::GetAccountInfo, account_response(Some(&record))),
                (RpcRequest::GetAccountInfo, account_response(None)),
            ],
        );
        assert!(matches!(
            resolve_with_config(
                &client,
                "pda.sol",
                AllowPda::Allow(vec![Pubkey::new_unique()]),
                true,
                TEST_NOW,
            ),
            Err(SnsError::PdaOwnerNotAllowed)
        ));
    }

    // Name registry account reads

    #[test]
    fn name_registry_resolvers_validate_accounts() {
        let owner = Pubkey::new_unique();
        let mut valid = registry_account(owner);
        valid.data.extend_from_slice(b"payload");
        let (client, _) = test_client(
            "blocking-name-registry-valid",
            [(RpcRequest::GetAccountInfo, account_response(Some(&valid)))],
        );
        let (header, payload) = resolve_name_registry(&client, &Pubkey::new_unique())
            .unwrap()
            .unwrap();
        assert_eq!(header.owner, owner);
        assert_eq!(payload, b"payload");

        let (client, _) = test_client("blocking-name-registry-missing", []);
        assert!(resolve_name_registry(&client, &Pubkey::new_unique())
            .unwrap()
            .is_none());

        let mut wrong_owner = registry_account(Pubkey::new_unique());
        wrong_owner.owner = Pubkey::new_unique();
        let undersized = Account {
            data: vec![0; NameRecordHeader::LEN - 1],
            owner: spl_name_service::ID,
            ..Account::default()
        };
        for (endpoint, account) in [
            ("blocking-name-registry-wrong-owner", &wrong_owner),
            ("blocking-name-registry-undersized", &undersized),
        ] {
            let (client, _) = test_client(
                endpoint,
                [(RpcRequest::GetAccountInfo, account_response(Some(account)))],
            );
            assert!(matches!(
                resolve_name_registry(&client, &Pubkey::new_unique()),
                Err(SnsError::InvalidNameAccountData)
            ));
        }

        let (client, _) = test_client(
            "blocking-name-registry-batch-wrong-owner",
            [(
                RpcRequest::GetMultipleAccounts,
                multiple_accounts_response(&[Some(&valid), None, Some(&wrong_owner)]),
            )],
        );
        assert!(matches!(
            resolve_name_registry_batch(
                &client,
                &[
                    Pubkey::new_unique(),
                    Pubkey::new_unique(),
                    Pubkey::new_unique()
                ]
            ),
            Err(SnsError::InvalidNameAccountData)
        ));
    }

    // SNS owner resolution

    #[test]
    fn rejects_missing_or_invalid_sns_registry_accounts() {
        let (client, sender) = test_client("blocking-sns-missing-domain", []);
        assert!(matches!(
            resolve_with_config(&client, "missing.sns", AllowPda::Deny, true, TEST_NOW),
            Err(SnsError::DomainDoesNotExist)
        ));
        assert_eq!(
            sender
                .requests()
                .iter()
                .map(|(request, _)| *request)
                .collect::<Vec<_>>(),
            vec![RpcRequest::GetMultipleAccounts]
        );

        let mut wrong_owner = registry_account(Pubkey::new_unique());
        wrong_owner.owner = Pubkey::new_unique();
        let (client, _) = test_client(
            "blocking-sns-registry-wrong-owner",
            [(
                RpcRequest::GetMultipleAccounts,
                multiple_accounts_response(&[None, None, None, Some(&wrong_owner)]),
            )],
        );
        assert!(matches!(
            resolve_with_config(&client, "forged.sns", AllowPda::Deny, false, TEST_NOW),
            Err(SnsError::InvalidNameAccountData)
        ));
    }

    /// An active tokenization record without a holder cannot fall back to SOL
    /// record V2, SOL record V1, or the name registry owner.
    #[test]
    fn rejects_active_sns_nft_without_holder() {
        let domain = "active";
        let domain_key = get_sns_domain_key(domain).unwrap().key;
        let mint_key = get_domain_mint(&domain_key);
        let registry = registry_account(Pubkey::new_unique());
        let nft_record = active_nft_record_account(domain_key, mint_key);
        let initial = multiple_accounts_response(&[Some(&nft_record), None, None, Some(&registry)]);

        let (client, _) = test_client(
            "blocking-sns-active-missing-holder",
            [(RpcRequest::GetMultipleAccounts, initial)],
        );
        assert!(matches!(
            resolve_with_config(&client, "active.sns", AllowPda::Deny, false, TEST_NOW),
            Err(SnsError::CouldNotFindNftOwner)
        ));
    }

    // RPC-backed integration tests

    #[cfg(not(feature = "devnet"))]
    #[test]
    fn resolves_reverse_record_from_rpc() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let key: Pubkey = pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb");
        let reverse = resolve_reverse(&client, &key).unwrap();
        assert_eq!(reverse.unwrap(), "bonfida");
    }

    #[cfg(not(feature = "devnet"))]
    #[test]
    fn resolves_sns_domains_from_rpc() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        let res = resolve(&client, "🇺🇸.sns", AllowPda::Deny).unwrap();
        assert_eq!(res, pubkey!("8fe1EFcmz4BYeX6zGp6HUdoaHjVYhzsv599ub52WJbos"));

        let res = resolve(&client, "0xluna.sns", AllowPda::Deny).unwrap();
        assert_eq!(res, pubkey!("8fe1EFcmz4BYeX6zGp6HUdoaHjVYhzsv599ub52WJbos"));

        let res = resolve(&client, "bonfida.sns", AllowPda::Deny).unwrap();
        assert_eq!(res, pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v"));
    }

    #[cfg(not(feature = "devnet"))]
    #[test]
    fn resolves_sns_ip_5_fixtures_from_rpc() {
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

        for (domain, expected) in cases {
            let domain = format!("{domain}.sns");
            let res = resolve(&client, &domain, AllowPda::Deny).unwrap();
            assert_eq!(res, expected, "domain {domain}");
        }
    }

    #[cfg(not(feature = "devnet"))]
    #[test]
    fn resolves_sns_ip_5_pda_fixtures_from_rpc() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let expected = pubkey!("96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr");
        let system_program = solana_program::system_program::ID;

        for domain in ["sns-ip-5-wallet-5", "sns-ip-5-wallet-10"] {
            let domain = format!("{domain}.sns");
            let res = resolve(&client, &domain, AllowPda::Allow(vec![system_program])).unwrap();
            assert_eq!(res, expected, "domain {domain} with Allow");

            let res = resolve(&client, &domain, AllowPda::AllowAny).unwrap();
            assert_eq!(res, expected, "domain {domain} with AllowAny");
        }
    }

    #[cfg(not(feature = "devnet"))]
    #[test]
    fn returns_expected_sns_ip_5_fixture_errors_from_rpc() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        let domain = "sns-ip-5-wallet-3.sns";
        let res = resolve(&client, domain, AllowPda::Deny);
        assert!(
            matches!(res, Err(SnsError::WrongValidation)),
            "{domain}: {res:?}"
        );

        let domain = "sns-ip-5-wallet-12.sns";
        let res = resolve(&client, domain, AllowPda::Deny);
        assert!(
            matches!(res, Err(SnsError::WrongValidation)),
            "{domain}: {res:?}"
        );

        let domain = "sns-ip-5-wallet-6.sns";
        let res = resolve(&client, domain, AllowPda::Deny);
        assert!(
            matches!(res, Err(SnsError::PdaOwnerNotAllowed)),
            "{domain}: {res:?}"
        );

        let domain = "sns-ip-5-wallet-11.sns";
        let res = resolve(&client, domain, AllowPda::Deny);
        assert!(
            matches!(res, Err(SnsError::PdaOwnerNotAllowed)),
            "{domain}: {res:?}"
        );

        let res = resolve(&client, "sns-ip-5-wallet-6.sns", AllowPda::Allow(vec![]));
        assert!(matches!(res, Err(SnsError::PdaOwnerNotAllowed)), "{res:?}");
    }
}
