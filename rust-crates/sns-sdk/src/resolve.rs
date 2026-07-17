use {
    crate::{
        derivation::{SOL_SRS_CLASS, SRS_PROGRAM_ID},
        error::SnsError,
    },
    solana_program::pubkey::Pubkey,
    solana_sdk::account::Account,
    spl_token_2022::{
        extension::StateWithExtensions,
        state::{Account as TokenAccount, AccountState, Mint},
    },
    std::time::{SystemTime, UNIX_EPOCH},
};

const SRS_RECORD_DISCRIMINATOR: u8 = 2;
const SRS_OWNER_TYPE_PUBKEY: u8 = 0;
const SRS_OWNER_TYPE_TOKEN: u8 = 1;
const SRS_ADDRESS_LENGTH: usize = 32;
const SRS_EXPIRY_LENGTH: usize = size_of::<i64>();
const SRS_RECORD_DISCRIMINATOR_OFFSET: usize = 0;
const SRS_RECORD_CLASS_OFFSET: usize = SRS_RECORD_DISCRIMINATOR_OFFSET + 1;
const SRS_RECORD_OWNER_TYPE_OFFSET: usize = SRS_RECORD_CLASS_OFFSET + SRS_ADDRESS_LENGTH;
const SRS_RECORD_OWNER_OFFSET: usize = SRS_RECORD_OWNER_TYPE_OFFSET + 1;
const SRS_RECORD_FROZEN_OFFSET: usize = SRS_RECORD_OWNER_OFFSET + SRS_ADDRESS_LENGTH;
const SRS_RECORD_EXPIRY_OFFSET: usize = SRS_RECORD_FROZEN_OFFSET + 1;
const SRS_RECORD_HEADER_LENGTH: usize = SRS_RECORD_EXPIRY_OFFSET + SRS_EXPIRY_LENGTH;

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
    if expiry <= now_unix_seconds {
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
    fn enforces_strict_expiry_boundary() {
        let owner = Pubkey::new_unique();
        for expiry in [NOW - 1, NOW] {
            assert!(matches!(
                parse_srs_record(
                    &SRS_PROGRAM_ID,
                    &record(SRS_OWNER_TYPE_PUBKEY, owner, expiry),
                    NOW,
                ),
                Err(SnsError::DomainExpired)
            ));
        }
        assert!(parse_srs_record(
            &SRS_PROGRAM_ID,
            &record(SRS_OWNER_TYPE_PUBKEY, owner, NOW + 1),
            NOW,
        )
        .is_ok());
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
}
