use {
    solana_program::{hash::hashv, pubkey, pubkey::Pubkey},
    spl_name_service::state::{get_seeds_and_key, HASH_PREFIX},
};

use crate::{
    error::SnsError,
    record::RecordVersion,
    tld::{parse_supported_tld, Tld},
};

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

#[inline(always)]
pub fn get_domain_key(domain: &str) -> Result<Pubkey, SnsError> {
    get_domain_key_with_parent(domain).map(|d| d.key)
}

pub struct DomainKeyWithParent {
    pub key: Pubkey,
    pub parent: Pubkey,
    pub is_sub: bool,
}

pub fn get_domain_key_with_parent(domain: &str) -> Result<DomainKeyWithParent, SnsError> {
    let (domain, tld) = parse_supported_tld(domain)?;
    match tld {
        Tld::Sns => get_sns_domain_key(domain),
        // `.sol` currently aliases to the SNS derivation path for compatibility.
        Tld::Sol => get_sol_domain_key(domain),
    }
}

pub(crate) fn get_sns_domain_key(domain: &str) -> Result<DomainKeyWithParent, SnsError> {
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

pub(crate) fn get_sol_domain_key(domain: &str) -> Result<DomainKeyWithParent, SnsError> {
    get_sns_domain_key(domain)
}

pub fn get_reverse_key(domain: &str) -> Result<Pubkey, SnsError> {
    let domain_key = get_domain_key_with_parent(domain)?;
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
    fn main_domain() {
        let result = get_domain_key("bonfida.sns").unwrap();
        let expected: Pubkey = pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb");
        assert_eq!(result, expected);
        let result = get_domain_key("bonfida.sol").unwrap();
        let expected: Pubkey = pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb");
        assert_eq!(result, expected);
    }
    #[test]
    fn sub_domain() {
        let result = get_domain_key("dex.bonfida.sns").unwrap();
        let expected: Pubkey = pubkey!("HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu");
        assert_eq!(result, expected);
        let result = get_domain_key("dex.bonfida.sol").unwrap();
        let expected: Pubkey = pubkey!("HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu");
        assert_eq!(result, expected);
    }

    #[test]
    fn bare_domain_errors() {
        assert!(matches!(
            get_domain_key("bonfida"),
            Err(SnsError::UnsupportedTld)
        ));
        assert!(matches!(
            get_domain_key("dex.bonfida"),
            Err(SnsError::UnsupportedTld)
        ));
    }
}
