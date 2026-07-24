use sns_sdk::{
    derivation::{get_sns_domain_key, DomainKeyWithParent},
    error::SnsError,
};

pub(crate) fn parse_sns_domain_key(domain: &str) -> Result<DomainKeyWithParent, SnsError> {
    let domain_name = sns_sdk::tld::parse_sns_domain(domain)?;
    get_sns_domain_key(&domain_name)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_sns_domain_key_uses_bare_name_derivation() {
        for (full_domain, bare_name) in [
            ("bonfida.sns", "bonfida"),
            ("dex.bonfida.sns", "dex.bonfida"),
        ] {
            let actual = parse_sns_domain_key(full_domain).unwrap();
            let expected = get_sns_domain_key(bare_name).unwrap();

            assert_eq!(actual.key, expected.key);
            assert_eq!(actual.parent, expected.parent);
            assert_eq!(actual.is_sub, expected.is_sub);
        }
    }

    #[test]
    fn parse_sns_domain_key_rejects_noncanonical_inputs() {
        for domain in ["bonfida", "bonfida.sol", "bonfida.eth"] {
            assert!(matches!(
                parse_sns_domain_key(domain),
                Err(SnsError::UnsupportedTld)
            ));
        }
        for domain in ["Bonfida.sns", " bonfida.sns"] {
            assert!(matches!(
                parse_sns_domain_key(domain),
                Err(SnsError::InvalidDomainCasing)
            ));
        }
        assert!(matches!(
            parse_sns_domain_key("bonfida.sns "),
            Err(SnsError::UnsupportedTld)
        ));
        for domain in [".sns", "bonfida..sns", "too.deep.bonfida.sns"] {
            assert!(matches!(
                parse_sns_domain_key(domain),
                Err(SnsError::InvalidDomain)
            ));
        }
    }
}
