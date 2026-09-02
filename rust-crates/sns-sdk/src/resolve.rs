use {
    crate::{
        derivation::{SOL_SRS_CLASS, SRS_PROGRAM_ID},
        error::SnsError,
    },
    solana_program::{program_pack::Pack, pubkey::Pubkey},
    solana_sdk::account::Account,
    spl_token_2022::{
        extension::{AccountType, BaseStateWithExtensions, StateWithExtensions},
        state::{Account as TokenAccount, AccountState, Mint},
    },
    spl_token_group_interface::state::TokenGroupMember,
    spl_token_metadata_interface::state::TokenMetadata,
    std::time::{SystemTime, UNIX_EPOCH},
};

pub(crate) const SRS_RECORD_DISCRIMINATOR: u8 = 2;
pub(crate) const SRS_OWNER_TYPE_PUBKEY: u8 = 0;
const SRS_OWNER_TYPE_TOKEN: u8 = 1;
const SRS_ADDRESS_LENGTH: usize = 32;
const SRS_EXPIRY_LENGTH: usize = size_of::<i64>();
const SRS_RECORD_DISCRIMINATOR_OFFSET: usize = 0;
pub(crate) const SRS_RECORD_CLASS_OFFSET: usize = SRS_RECORD_DISCRIMINATOR_OFFSET + 1;
pub(crate) const SRS_RECORD_OWNER_TYPE_OFFSET: usize = SRS_RECORD_CLASS_OFFSET + SRS_ADDRESS_LENGTH;
pub(crate) const SRS_RECORD_OWNER_OFFSET: usize = SRS_RECORD_OWNER_TYPE_OFFSET + 1;
const SRS_RECORD_FROZEN_OFFSET: usize = SRS_RECORD_OWNER_OFFSET + SRS_ADDRESS_LENGTH;
const SRS_RECORD_EXPIRY_OFFSET: usize = SRS_RECORD_FROZEN_OFFSET + 1;
const SRS_RECORD_HEADER_LENGTH: usize = SRS_RECORD_EXPIRY_OFFSET + SRS_EXPIRY_LENGTH;
/// Offset of the trailing Token-2022-compatible metadata in an SRS record account.
const SRS_RECORD_METADATA_OFFSET: usize = SRS_RECORD_HEADER_LENGTH + 1 + 32;

/// Caller policy for resolving a final owner that is a program-derived address.
#[derive(Debug, Clone)]
pub enum AllowPda {
    /// Reject a final PDA owner.
    Deny,
    /// Allow the PDA when its runtime owner is one of these programs.
    Allow(Vec<Pubkey>),
    /// Return a final PDA owner without inspecting its runtime owner.
    AllowAny,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum SrsRecordOwner {
    Pubkey(Pubkey),
    Token(Pubkey),
}

/// Returns the current Unix timestamp in whole seconds.
pub(crate) fn current_unix_timestamp() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
        .try_into()
        .unwrap_or(i64::MAX)
}

/// Parses and validates the fixed SRS record header at an injected time boundary.
pub(crate) fn parse_srs_record(
    account_owner: &Pubkey,
    data: &[u8],
    now_unix_seconds: i64,
) -> Result<SrsRecordOwner, SnsError> {
    if account_owner != &SRS_PROGRAM_ID
        || data.len() < SRS_RECORD_HEADER_LENGTH
        || data[SRS_RECORD_DISCRIMINATOR_OFFSET] != SRS_RECORD_DISCRIMINATOR
    {
        return Err(SnsError::RecordMalformed);
    }

    let record_class = Pubkey::new_from_array(
        data[SRS_RECORD_CLASS_OFFSET..SRS_RECORD_CLASS_OFFSET + SRS_ADDRESS_LENGTH]
            .try_into()
            .map_err(|_| SnsError::RecordMalformed)?,
    );
    if record_class != SOL_SRS_CLASS {
        return Err(SnsError::RecordMalformed);
    }

    let owner_type = data[SRS_RECORD_OWNER_TYPE_OFFSET];
    if owner_type != SRS_OWNER_TYPE_PUBKEY && owner_type != SRS_OWNER_TYPE_TOKEN {
        return Err(SnsError::RecordMalformed);
    }

    let expiry = i64::from_le_bytes(
        data[SRS_RECORD_EXPIRY_OFFSET..SRS_RECORD_HEADER_LENGTH]
            .try_into()
            .map_err(|_| SnsError::RecordMalformed)?,
    );
    // Zero is the SRS sentinel for a record that does not expire.
    if expiry != 0 && expiry <= now_unix_seconds {
        return Err(SnsError::DomainExpired);
    }

    let owner = Pubkey::new_from_array(
        data[SRS_RECORD_OWNER_OFFSET..SRS_RECORD_OWNER_OFFSET + SRS_ADDRESS_LENGTH]
            .try_into()
            .map_err(|_| SnsError::RecordMalformed)?,
    );
    match owner_type {
        SRS_OWNER_TYPE_PUBKEY => Ok(SrsRecordOwner::Pubkey(owner)),
        SRS_OWNER_TYPE_TOKEN => Ok(SrsRecordOwner::Token(owner)),
        _ => unreachable!(),
    }
}

/// Derives the only valid Token-2022 mint for an SRS record.
pub(crate) fn get_srs_token_mint(record: &Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[b"mint", record.as_ref()], &SRS_PROGRAM_ID).0
}

/// Base Token-2022 account data plus its account-type byte.
pub(crate) const TOKEN_2022_ACCOUNT_DATA_SLICE: usize = TokenAccount::LEN + 1;

/// Reads a Token-2022 mint from the intentionally truncated account data returned
/// by the owner scan. This mirrors JavaScript's `unpackAccount`: decode the base
/// account and validate the account-type byte without attempting to parse TLV data.
pub(crate) fn parse_sliced_token_2022_account_mint(data: &[u8]) -> Option<Pubkey> {
    let base_data = data.get(..TokenAccount::LEN)?;
    if let Some(account_type) = data.get(TokenAccount::LEN) {
        if *account_type != u8::from(AccountType::Account) {
            return None;
        }
    }
    TokenAccount::unpack(base_data)
        .ok()
        .map(|account| account.mint)
}

/// Validates an SRS Token-2022 mint, including extension-bearing accounts.
pub(crate) fn validate_srs_token_mint(account: &Account) -> Result<(), SnsError> {
    if account.owner != spl_token_2022::ID {
        return Err(SnsError::CouldNotFindSrsOwner);
    }
    let mint = StateWithExtensions::<Mint>::unpack(&account.data)
        .map_err(|_| SnsError::CouldNotFindSrsOwner)?;
    if !mint.base.is_initialized || mint.base.decimals != 0 || mint.base.supply != 1 {
        return Err(SnsError::CouldNotFindSrsOwner);
    }
    Ok(())
}

/// Validates an SRS Token-2022 holder account and returns its final owner.
pub(crate) fn parse_srs_token_holder(account: &Account, mint: &Pubkey) -> Result<Pubkey, SnsError> {
    if account.owner != spl_token_2022::ID {
        return Err(SnsError::CouldNotFindSrsOwner);
    }
    let holder = StateWithExtensions::<TokenAccount>::unpack(&account.data)
        .map_err(|_| SnsError::CouldNotFindSrsOwner)?;
    if holder.base.mint != *mint
        || holder.base.amount != 1
        || !matches!(
            holder.base.state,
            AccountState::Initialized | AccountState::Frozen
        )
    {
        return Err(SnsError::CouldNotFindSrsOwner);
    }
    Ok(holder.base.owner)
}

/// Reads a borsh-encoded string (4-byte little-endian length + UTF-8 bytes).
fn parse_borsh_string(data: &[u8]) -> Result<&str, SnsError> {
    let len = u32::from_le_bytes(
        data.get(..4)
            .ok_or(SnsError::RecordMalformed)?
            .try_into()
            .map_err(|_| SnsError::RecordMalformed)?,
    ) as usize;
    let bytes = data
        .get(4..4usize.saturating_add(len))
        .ok_or(SnsError::RecordMalformed)?;
    std::str::from_utf8(bytes).map_err(|_| SnsError::RecordMalformed)
}

/// Reads the domain name from the trailing Token-2022-compatible metadata of an
/// SRS record account.
pub(crate) fn parse_srs_record_metadata_name(data: &[u8]) -> Result<String, SnsError> {
    let metadata = data
        .get(SRS_RECORD_METADATA_OFFSET..)
        .ok_or(SnsError::RecordMalformed)?;
    parse_borsh_string(metadata).map(str::to_owned)
}

/// Derives the Token-2022 token group PDA that canonical `.sol` domain NFTs belong to.
pub(crate) fn sol_srs_group_pda() -> Pubkey {
    Pubkey::find_program_address(&[b"group", SOL_SRS_CLASS.as_ref()], &SRS_PROGRAM_ID).0
}

/// Validates a candidate SRS Token-2022 mint for `.sol` domain NFT ownership and
/// returns its metadata domain name, or `None` when the account is not a canonical
/// SRS group member carrying metadata.
pub(crate) fn parse_srs_nft_mint_name(
    account: &Account,
    expected_mint: &Pubkey,
    sol_group: &Pubkey,
) -> Option<String> {
    if account.owner != spl_token_2022::ID {
        return None;
    }
    let state = StateWithExtensions::<Mint>::unpack(&account.data).ok()?;
    if !state.base.is_initialized || state.base.decimals != 0 || state.base.supply != 1 {
        return None;
    }
    let member = state.get_extension::<TokenGroupMember>().ok()?;
    if member.mint != *expected_mint || member.group != *sol_group {
        return None;
    }
    let metadata: TokenMetadata = state
        .get_variable_len_extension()
        .map_err(|_| SnsError::RecordMalformed)
        .ok()?;
    Some(metadata.name)
}

/// Builds an SRS record fixture for mode-specific resolver tests.
#[cfg(test)]
pub(crate) fn srs_record_data(owner: SrsRecordOwner, expiry: i64) -> Vec<u8> {
    let (owner_type, owner) = match owner {
        SrsRecordOwner::Pubkey(owner) => (SRS_OWNER_TYPE_PUBKEY, owner),
        SrsRecordOwner::Token(owner) => (SRS_OWNER_TYPE_TOKEN, owner),
    };
    let mut data = vec![0; SRS_RECORD_HEADER_LENGTH];
    data[SRS_RECORD_DISCRIMINATOR_OFFSET] = SRS_RECORD_DISCRIMINATOR;
    data[SRS_RECORD_CLASS_OFFSET..SRS_RECORD_CLASS_OFFSET + SRS_ADDRESS_LENGTH]
        .copy_from_slice(SOL_SRS_CLASS.as_ref());
    data[SRS_RECORD_OWNER_TYPE_OFFSET] = owner_type;
    data[SRS_RECORD_OWNER_OFFSET..SRS_RECORD_OWNER_OFFSET + SRS_ADDRESS_LENGTH]
        .copy_from_slice(owner.as_ref());
    data[SRS_RECORD_EXPIRY_OFFSET..SRS_RECORD_HEADER_LENGTH].copy_from_slice(&expiry.to_le_bytes());
    data
}

/// Builds an extension-bearing Token-2022 mint fixture.
#[cfg(test)]
pub(crate) fn token_2022_mint_account(supply: u64, decimals: u8, is_initialized: bool) -> Account {
    use {
        solana_program::program_option::COption,
        spl_token_2022::extension::{
            mint_close_authority::MintCloseAuthority, BaseStateWithExtensionsMut, ExtensionType,
            StateWithExtensionsMut,
        },
    };

    let mut data =
        vec![
            0;
            ExtensionType::try_calculate_account_len::<Mint>(&[ExtensionType::MintCloseAuthority,])
                .unwrap()
        ];
    let mut mint = StateWithExtensionsMut::<Mint>::unpack_uninitialized(&mut data).unwrap();
    mint.init_extension::<MintCloseAuthority>(true).unwrap();
    mint.base = Mint {
        mint_authority: COption::None,
        supply,
        decimals,
        is_initialized,
        freeze_authority: COption::None,
    };
    mint.pack_base();
    mint.init_account_type().unwrap();
    Account {
        data,
        owner: spl_token_2022::ID,
        ..Account::default()
    }
}

/// Builds an extension-bearing Token-2022 holder fixture.
#[cfg(test)]
pub(crate) fn token_2022_holder_account(
    mint: Pubkey,
    owner: Pubkey,
    amount: u64,
    state: AccountState,
) -> Account {
    use {
        solana_program::program_option::COption,
        spl_token_2022::extension::{
            immutable_owner::ImmutableOwner, BaseStateWithExtensionsMut, ExtensionType,
            StateWithExtensionsMut,
        },
    };

    let mut data = vec![
        0;
        ExtensionType::try_calculate_account_len::<TokenAccount>(&[
            ExtensionType::ImmutableOwner,
        ])
        .unwrap()
    ];
    let mut holder =
        StateWithExtensionsMut::<TokenAccount>::unpack_uninitialized(&mut data).unwrap();
    holder.init_extension::<ImmutableOwner>(true).unwrap();
    holder.base = TokenAccount {
        mint,
        owner,
        amount,
        delegate: COption::None,
        state,
        is_native: COption::None,
        delegated_amount: 0,
        close_authority: COption::None,
    };
    holder.pack_base();
    holder.init_account_type().unwrap();
    Account {
        data,
        owner: spl_token_2022::ID,
        ..Account::default()
    }
}

#[cfg(test)]
mod tests {
    use {super::*, solana_program::pubkey};

    const NOW: i64 = 1_000;

    fn record(owner_type: u8, owner: Pubkey, expiry: i64) -> Vec<u8> {
        srs_record_data(
            if owner_type == SRS_OWNER_TYPE_PUBKEY {
                SrsRecordOwner::Pubkey(owner)
            } else if owner_type == SRS_OWNER_TYPE_TOKEN {
                SrsRecordOwner::Token(owner)
            } else {
                let mut data = srs_record_data(SrsRecordOwner::Pubkey(owner), expiry);
                data[SRS_RECORD_OWNER_TYPE_OFFSET] = owner_type;
                return data;
            },
            expiry,
        )
    }

    #[test]
    fn parses_sliced_token_2022_account_mint() {
        let mint = Pubkey::new_unique();
        let owner = Pubkey::new_unique();
        let account = token_2022_holder_account(mint, owner, 1, AccountState::Initialized);

        assert!(account.data.len() > TOKEN_2022_ACCOUNT_DATA_SLICE);
        assert_eq!(
            parse_sliced_token_2022_account_mint(&account.data[..TOKEN_2022_ACCOUNT_DATA_SLICE]),
            Some(mint)
        );
        assert_eq!(
            parse_sliced_token_2022_account_mint(&account.data[..TokenAccount::LEN]),
            Some(mint)
        );
    }

    #[test]
    fn rejects_invalid_sliced_token_2022_accounts() {
        let mint = Pubkey::new_unique();
        let owner = Pubkey::new_unique();
        let account = token_2022_holder_account(mint, owner, 1, AccountState::Initialized);

        assert!(
            parse_sliced_token_2022_account_mint(&account.data[..TokenAccount::LEN - 1]).is_none()
        );

        let mut wrong_account_type = account.data[..TOKEN_2022_ACCOUNT_DATA_SLICE].to_vec();
        wrong_account_type[TokenAccount::LEN] = u8::from(AccountType::Mint);
        assert!(parse_sliced_token_2022_account_mint(&wrong_account_type).is_none());

        let uninitialized = token_2022_holder_account(mint, owner, 1, AccountState::Uninitialized);
        assert!(parse_sliced_token_2022_account_mint(
            &uninitialized.data[..TOKEN_2022_ACCOUNT_DATA_SLICE]
        )
        .is_none());
    }

    #[test]
    fn parses_direct_and_token_owners() {
        let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
        assert_eq!(
            parse_srs_record(
                &SRS_PROGRAM_ID,
                &record(SRS_OWNER_TYPE_PUBKEY, owner, NOW + 1),
                NOW,
            )
            .unwrap(),
            SrsRecordOwner::Pubkey(owner)
        );
        assert_eq!(
            parse_srs_record(
                &SRS_PROGRAM_ID,
                &record(SRS_OWNER_TYPE_TOKEN, owner, NOW + 1),
                NOW,
            )
            .unwrap(),
            SrsRecordOwner::Token(owner)
        );
    }

    #[test]
    fn rejects_malformed_srs_records() {
        let owner = Pubkey::new_unique();
        let valid = record(SRS_OWNER_TYPE_PUBKEY, owner, NOW + 1);
        assert!(matches!(
            parse_srs_record(&Pubkey::new_unique(), &valid, NOW),
            Err(SnsError::RecordMalformed)
        ));
        assert!(matches!(
            parse_srs_record(&SRS_PROGRAM_ID, &valid[..valid.len() - 1], NOW),
            Err(SnsError::RecordMalformed)
        ));

        let mut wrong_discriminator = valid.clone();
        wrong_discriminator[SRS_RECORD_DISCRIMINATOR_OFFSET] = 1;
        assert!(matches!(
            parse_srs_record(&SRS_PROGRAM_ID, &wrong_discriminator, NOW),
            Err(SnsError::RecordMalformed)
        ));

        let mut wrong_class = valid.clone();
        wrong_class[SRS_RECORD_CLASS_OFFSET..SRS_RECORD_CLASS_OFFSET + SRS_ADDRESS_LENGTH]
            .copy_from_slice(Pubkey::new_unique().as_ref());
        assert!(matches!(
            parse_srs_record(&SRS_PROGRAM_ID, &wrong_class, NOW),
            Err(SnsError::RecordMalformed)
        ));

        let invalid_type = record(2, owner, NOW + 1);
        assert!(matches!(
            parse_srs_record(&SRS_PROGRAM_ID, &invalid_type, NOW),
            Err(SnsError::RecordMalformed)
        ));
    }

    #[test]
    fn supports_zero_expiry_and_enforces_nonzero_boundary() {
        let owner = Pubkey::new_unique();
        for expiry in [-1, NOW - 1, NOW] {
            assert!(matches!(
                parse_srs_record(
                    &SRS_PROGRAM_ID,
                    &record(SRS_OWNER_TYPE_PUBKEY, owner, expiry),
                    NOW,
                ),
                Err(SnsError::DomainExpired)
            ));
        }
        for expiry in [0, NOW + 1] {
            assert!(parse_srs_record(
                &SRS_PROGRAM_ID,
                &record(SRS_OWNER_TYPE_PUBKEY, owner, expiry),
                NOW,
            )
            .is_ok());
        }
    }

    #[test]
    fn ignores_frozen_flag_and_trailing_bytes() {
        let owner = Pubkey::new_unique();
        let mut data = record(SRS_OWNER_TYPE_PUBKEY, owner, NOW + 1);
        data[SRS_RECORD_FROZEN_OFFSET] = 1;
        data.extend_from_slice(&[7, 8, 9]);
        assert_eq!(
            parse_srs_record(&SRS_PROGRAM_ID, &data, NOW).unwrap(),
            SrsRecordOwner::Pubkey(owner)
        );
    }

    #[test]
    fn validates_extension_bearing_token_2022_mints() {
        assert!(validate_srs_token_mint(&token_2022_mint_account(1, 0, true)).is_ok());

        let mut mint_owned_by_wrong_program = token_2022_mint_account(1, 0, true);
        mint_owned_by_wrong_program.owner = Pubkey::new_unique();
        for invalid in [
            mint_owned_by_wrong_program,
            Account {
                data: vec![0],
                owner: spl_token_2022::ID,
                ..Account::default()
            },
            token_2022_mint_account(1, 0, false),
            token_2022_mint_account(1, 1, true),
            token_2022_mint_account(2, 0, true),
        ] {
            assert!(matches!(
                validate_srs_token_mint(&invalid),
                Err(SnsError::CouldNotFindSrsOwner)
            ));
        }
    }

    #[test]
    fn validates_extension_bearing_token_2022_holders() {
        let mint = Pubkey::new_unique();
        let owner = Pubkey::new_unique();
        for state in [AccountState::Initialized, AccountState::Frozen] {
            assert_eq!(
                parse_srs_token_holder(&token_2022_holder_account(mint, owner, 1, state), &mint,)
                    .unwrap(),
                owner
            );
        }

        let mut holder_owned_by_wrong_program =
            token_2022_holder_account(mint, owner, 1, AccountState::Initialized);
        holder_owned_by_wrong_program.owner = Pubkey::new_unique();
        for invalid in [
            holder_owned_by_wrong_program,
            Account {
                data: vec![0],
                owner: spl_token_2022::ID,
                ..Account::default()
            },
            token_2022_holder_account(Pubkey::new_unique(), owner, 1, AccountState::Initialized),
            token_2022_holder_account(mint, owner, 0, AccountState::Initialized),
            token_2022_holder_account(mint, owner, 1, AccountState::Uninitialized),
        ] {
            assert!(matches!(
                parse_srs_token_holder(&invalid, &mint),
                Err(SnsError::CouldNotFindSrsOwner)
            ));
        }
    }

    #[test]
    fn parses_srs_record_metadata_name() {
        let mut data = record(SRS_OWNER_TYPE_PUBKEY, Pubkey::new_unique(), NOW + 1);
        data.resize(SRS_RECORD_METADATA_OFFSET, 0);
        let name = "sns-ip-5-wallet-1";
        data.extend_from_slice(&(name.len() as u32).to_le_bytes());
        data.extend_from_slice(name.as_bytes());
        assert_eq!(parse_srs_record_metadata_name(&data).unwrap(), name);

        // Truncated length prefix.
        let mut short = data.clone();
        short.truncate(SRS_RECORD_METADATA_OFFSET + 2);
        assert!(parse_srs_record_metadata_name(&short).is_err());

        // Length prefix overruns the data.
        let mut over = data.clone();
        let offset = SRS_RECORD_METADATA_OFFSET;
        over[offset..offset + 4].copy_from_slice(&9999u32.to_le_bytes());
        assert!(parse_srs_record_metadata_name(&over).is_err());

        // Invalid UTF-8 payload.
        let mut invalid = data.clone();
        invalid[offset + 4] = 0xFF;
        assert!(parse_srs_record_metadata_name(&invalid).is_err());

        // Data shorter than the metadata offset.
        assert!(parse_srs_record_metadata_name(&data[..16]).is_err());
    }

    #[test]
    fn derives_sol_group_pda() {
        let group = sol_srs_group_pda();
        let (expected, _) =
            Pubkey::find_program_address(&[b"group", SOL_SRS_CLASS.as_ref()], &SRS_PROGRAM_ID);
        assert_eq!(group, expected);
    }

    #[test]
    fn rejects_srs_nft_mint_without_group_member() {
        let mint = Pubkey::new_unique();
        let account = token_2022_mint_account(1, 0, true);
        assert!(parse_srs_nft_mint_name(&account, &mint, &sol_srs_group_pda()).is_none());
    }
}
