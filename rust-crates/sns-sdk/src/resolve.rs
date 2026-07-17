use {
    crate::{
        derivation::{SOL_SRS_CLASS, SRS_PROGRAM_ID},
        error::SnsError,
    },
    solana_program::pubkey::Pubkey,
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
    fn rejects_wrong_program_short_and_malformed_records() {
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
}
