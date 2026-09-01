use {
    solana_program::{hash::hashv, pubkey, pubkey::Pubkey},
    spl_name_service::state::{get_seeds_and_key, HASH_PREFIX},
};

use crate::{error::SnsError, record::RecordVersion};

pub const SOL_REGISTRAR_PROGRAM_ID: Pubkey = pubkey!("soL7856gZrjQMSJMT33YDpfAuRYbetAbkZPuv7YeLht");
pub const SRS_PROGRAM_ID: Pubkey = pubkey!("srsWjm76StJucL7atFyPSdXFaVLNPFqEt1uFEDPrZsn");
pub const SRS_CENTRAL_STATE: Pubkey = pubkey!("EoLdmhHPRZ4xkYj4MetaAR8LjALmqGQEMsKQnFJx6ihE");
pub const SOL_SRS_CLASS: Pubkey = pubkey!("Dqc9TrYg1AZLEa6UkZUqCDrr9zsHQveo1szGTE1BTW5");
pub const SRS_HASH_PREFIX: &[u8; 4] = b"name";

pub use constants::*;
#[cfg(not(feature = "devnet"))]
mod constants {
    use super::*;

    pub const ROOT_DOMAIN_ACCOUNT: Pubkey = pubkey!("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx");
    pub const REVERSE_LOOKUP_CLASS: Pubkey =
        pubkey!("33m47vH6Eav6jr5Ry86XjhRft2jRBLDnDgPSHoquXi2Z");

    pub const MINT_PREFIX: &[u8; 14] = b"tokenized_name";
    pub const NAME_TOKENIZER_ID: Pubkey = pubkey!("nftD3vbNkNqfj2Sd3HZwbpw4BxxKWr4AjGb9X38JeZk");
}
#[cfg(feature = "devnet")]
mod constants {
    use super::*;

    pub const ROOT_DOMAIN_ACCOUNT: Pubkey = pubkey!("5eoDkP6vCQBXqDV9YN2NdUs3nmML3dMRNmEYpiyVNBm2");
    pub const REVERSE_LOOKUP_CLASS: Pubkey =
        pubkey!("7NbD1vprif6apthEZAqhRfYuhrqnuderB8qpnfXGCc8H");

    pub const MINT_PREFIX: &[u8; 14] = b"tokenized_name";
    // TODO
    pub const NAME_TOKENIZER_ID: Pubkey = pubkey!("nftD3vbNkNqfj2Sd3HZwbpw4BxxKWr4AjGb9X38JeZk");
}

#[derive(Copy, Clone, Debug)]
pub enum Domain {
    Main,
    Sub,
    Record(RecordVersion),
}

pub fn get_prefix(domain: Domain) -> String {
    match domain {
        Domain::Main => "".to_string(),
        Domain::Sub => "\0".to_string(),
        Domain::Record(RecordVersion::V1) => "\x01".to_string(),
        Domain::Record(RecordVersion::V2) => "\x02".to_string(),
    }
}

pub fn get_hashed_name(name: &str) -> Vec<u8> {
    hashv(&[(HASH_PREFIX.to_owned() + name).as_bytes()])
        .as_ref()
        .to_vec()
}

pub fn derive(domain: &str, parent: &Pubkey, name_class: Option<Pubkey>) -> Pubkey {
    let hashed_name = get_hashed_name(domain);
    let (key, _) = get_seeds_and_key(
        &spl_name_service::ID,
        hashed_name,
        name_class.as_ref(),
        Some(parent),
    );
    key
}

pub fn derive_reverse(domain_key: &Pubkey, parent: Option<&Pubkey>) -> Pubkey {
    let hashed = get_hashed_name(&domain_key.to_string());
    let (key, _) = get_seeds_and_key(
        &spl_name_service::ID,
        hashed,
        Some(&REVERSE_LOOKUP_CLASS),
        parent,
    );
    key
}

pub struct DomainKeyWithParent {
    pub key: Pubkey,
    pub parent: Pubkey,
    pub is_sub: bool,
}

/// Derives an SNS namespace account from a TLD-trimmed domain name.
pub fn get_sns_domain_key(domain: &str) -> Result<DomainKeyWithParent, SnsError> {
    let splitted = domain.split('.').collect::<Vec<_>>();
    match splitted.len() {
        1 => {
            let key = derive(domain, &ROOT_DOMAIN_ACCOUNT, None);
            Ok(DomainKeyWithParent {
                key,
                parent: ROOT_DOMAIN_ACCOUNT,
                is_sub: false,
            })
        }
        2 => {
            let parent = derive(splitted[1], &ROOT_DOMAIN_ACCOUNT, None);
            let sub_domain = get_prefix(Domain::Sub) + splitted[0];
            let key = derive(&sub_domain, &parent, None);
            Ok(DomainKeyWithParent {
                key,
                parent,
                is_sub: true,
            })
        }
        _ => Err(SnsError::InvalidDomain),
    }
}

#[derive(Copy, Clone, Debug, PartialEq, Eq)]
pub struct SolDomainKey {
    pub key: Pubkey,
    pub hashed: [u8; 32],
}

/// Derives the canonical SRS record account for a TLD-trimmed `.sol` name.
pub fn get_sol_domain_key(domain: &str) -> SolDomainKey {
    let hashed = hashv(&[SRS_HASH_PREFIX, domain.as_bytes()]).to_bytes();
    let key = Pubkey::find_program_address(
        &[b"record", SOL_SRS_CLASS.as_ref(), &hashed],
        &SRS_PROGRAM_ID,
    )
    .0;

    SolDomainKey { key, hashed }
}

/// The deprecated SRS-oriented result name for [`SolDomainKey`].
#[deprecated(note = "use SolDomainKey instead")]
pub type SrsDomainKey = SolDomainKey;

/// Derives the canonical SRS record account for a TLD-trimmed `.sol` name.
#[deprecated(note = "use get_sol_domain_key instead")]
#[allow(deprecated)]
pub fn get_srs_domain_key(domain: &str) -> SrsDomainKey {
    get_sol_domain_key(domain)
}

/// Derives an SNS reverse lookup account from a TLD-trimmed domain name.
pub fn get_reverse_key(domain: &str) -> Result<Pubkey, SnsError> {
    let domain_key = get_sns_domain_key(domain)?;
    let parent = domain_key.is_sub.then_some(&domain_key.parent);
    Ok(derive_reverse(&domain_key.key, parent))
}

pub fn get_domain_mint(domain_key: &Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[MINT_PREFIX, &domain_key.to_bytes()], &NAME_TOKENIZER_ID).0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sns_main_domain() {
        let result = get_sns_domain_key("bonfida").unwrap().key;
        #[cfg(not(feature = "devnet"))]
        let expected: Pubkey = pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb");
        #[cfg(feature = "devnet")]
        let expected: Pubkey = pubkey!("4ep71Np8ynS8wyngmkKrowmB9uV72pNMhLCvF8x1Achu");
        assert_eq!(result, expected);
    }

    #[test]
    fn sns_sub_domain() {
        let result = get_sns_domain_key("dex.bonfida").unwrap().key;
        #[cfg(not(feature = "devnet"))]
        let expected: Pubkey = pubkey!("HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu");
        #[cfg(feature = "devnet")]
        let expected: Pubkey = pubkey!("8kTNkVPtNEPphCNrzUrW5Dza2zbpH4sXeiLJegTxXWn");
        assert_eq!(result, expected);
    }

    #[test]
    fn sns_reverse_key() {
        let result = get_reverse_key("bonfida").unwrap();
        #[cfg(not(feature = "devnet"))]
        let expected: Pubkey = pubkey!("DqgmWxe2PPrfy45Ja3UPyFGwcbRzkRuwXt3NyxjX8krg");
        #[cfg(feature = "devnet")]
        let expected: Pubkey = pubkey!("3LFXQPTbDE4be61QjCuG1t1CeVWHUttzbg9TE3A66NWm");
        assert_eq!(result, expected);
    }

    #[test]
    fn srs_constants_match_canonical_pdas() {
        let central_state =
            Pubkey::find_program_address(&[b"central_state"], &SOL_REGISTRAR_PROGRAM_ID).0;
        assert_eq!(SRS_CENTRAL_STATE, central_state);

        let class = Pubkey::find_program_address(
            &[b"class", central_state.as_ref(), b".sol"],
            &SRS_PROGRAM_ID,
        )
        .0;
        assert_eq!(SOL_SRS_CLASS, class);
    }

    #[test]
    fn sol_domain_key_matches_ref_fixtures() {
        for (domain, expected_key) in [
            (
                "sns-ip-5-wallet-1",
                pubkey!("5aJnvSs3K5J1eFS1cemYHWnUeWp3QjKThWh5mWbGBgkt"),
            ),
            (
                "sns-ip-5-wallet-2",
                pubkey!("2gN2aGXi9kRnkXewWsshKTUWairEvMapA3z1EaqFqwMd"),
            ),
        ] {
            assert_eq!(get_sol_domain_key(domain).key, expected_key);
        }
    }

    #[test]
    fn deprecated_get_srs_domain_key_matches_canonical_derivation() {
        #[allow(deprecated)]
        let legacy = get_srs_domain_key("sns-ip-5-wallet-1");
        let canonical = get_sol_domain_key("sns-ip-5-wallet-1");
        assert_eq!(legacy, canonical);
    }
}
