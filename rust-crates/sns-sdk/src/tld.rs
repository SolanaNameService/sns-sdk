//! Domain TLD suffix parsing and validation helpers.
//!
//! Mirrors the JS SDK v4 `utils/tld.ts` and `utils/parseSnsDomain.ts`:
//!
//! - Read / key-derivation APIs accept `.sns` or `.sol` (see [`parse_supported_tld`]).
//!   `.sol` is treated as an alias of the `.sns` derivation path.
//! - Write APIs accept only canonical `.sns` names (see [`parse_sns_domain`] and
//!   [`parse_sns_top_level_domain`]).

use crate::error::SnsError;

pub const SOL_TLD: &str = ".sol";
pub const SNS_TLD: &str = ".sns";
/// A supported top-level domain suffix.
#[derive(Copy, Clone, Debug, PartialEq, Eq)]
pub enum Tld {
    Sns,
    Sol,
}

pub const SUPPORTED_TLDS: [Tld; 2] = [Tld::Sns, Tld::Sol];

impl Tld {
    pub fn as_str(&self) -> &'static str {
        match self {
            Tld::Sns => SNS_TLD,
            Tld::Sol => SOL_TLD,
        }
    }
}

/// A name is canonical when it has no surrounding whitespace and no uppercase
/// characters, i.e. `name.trim().to_lowercase() == name`.
fn is_canonical_lowercase(name: &str) -> bool {
    name.trim().to_lowercase() == name
}

/// Validates that `domain` ends with a supported read-side TLD (`.sns` or `.sol`),
/// strips that suffix, and returns `(bare_name, tld)`.
///
/// Bare names without a supported suffix return [`SnsError::UnsupportedTld`].
pub fn parse_supported_tld(domain: &str) -> Result<(&str, Tld), SnsError> {
    SUPPORTED_TLDS
        .iter()
        .find_map(|&tld| domain.strip_suffix(tld.as_str()).map(|bare| (bare, tld)))
        .ok_or(SnsError::UnsupportedTld)
}

/// Parses a writable `.sns` domain, allowing either `name.sns` or `sub.parent.sns`,
/// and returns the raw (suffix-stripped) name.
///
/// Rejects `.sol` / bare names ([`SnsError::UnsupportedTld`]), non-canonical casing or
/// surrounding whitespace ([`SnsError::InvalidDomainCasing`]), and malformed label
/// structure — empty labels or more than two labels ([`SnsError::InvalidDomain`]).
pub fn parse_sns_domain(domain: &str) -> Result<String, SnsError> {
    let bare = domain.strip_suffix(SNS_TLD).ok_or(SnsError::UnsupportedTld)?;

    if !is_canonical_lowercase(bare) {
        return Err(SnsError::InvalidDomainCasing);
    }

    let labels = bare.split('.').collect::<Vec<_>>();
    if labels.len() > 2 || labels.iter().any(|label| label.is_empty()) {
        return Err(SnsError::InvalidDomain);
    }

    Ok(bare.to_string())
}

/// Parses a writable top-level `.sns` domain (`name.sns` only) and returns the raw
/// (suffix-stripped) name.
///
/// Rejects `.sol` / bare names ([`SnsError::UnsupportedTld`]), subdomains such as
/// `sub.parent.sns` ([`SnsError::SubdomainNotAllowed`]), non-canonical casing or
/// surrounding whitespace ([`SnsError::InvalidDomainCasing`]), and empty names
/// ([`SnsError::InvalidDomain`]).
pub fn parse_sns_top_level_domain(domain: &str) -> Result<String, SnsError> {
    let bare = domain.strip_suffix(SNS_TLD).ok_or(SnsError::UnsupportedTld)?;

    if bare.is_empty() {
        return Err(SnsError::InvalidDomain);
    }
    if bare.contains('.') {
        return Err(SnsError::SubdomainNotAllowed);
    }
    if !is_canonical_lowercase(bare) {
        return Err(SnsError::InvalidDomainCasing);
    }

    Ok(bare.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_supported_tld_accepts_sns_and_sol() {
        assert_eq!(parse_supported_tld("mydomain.sns").unwrap(), ("mydomain", Tld::Sns));
        assert_eq!(parse_supported_tld("mydomain.sol").unwrap(), ("mydomain", Tld::Sol));
        assert_eq!(
            parse_supported_tld("sub.mydomain.sns").unwrap(),
            ("sub.mydomain", Tld::Sns)
        );
        assert_eq!(
            parse_supported_tld("sub.mydomain.sol").unwrap(),
            ("sub.mydomain", Tld::Sol)
        );
    }

    #[test]
    fn parse_supported_tld_rejects_bare_and_unknown() {
        assert!(matches!(
            parse_supported_tld("mydomain"),
            Err(SnsError::UnsupportedTld)
        ));
        assert!(matches!(
            parse_supported_tld("mydomain.eth"),
            Err(SnsError::UnsupportedTld)
        ));
        // Trailing whitespace means the string does not end with a supported TLD.
        assert!(matches!(
            parse_supported_tld("mydomain.sns "),
            Err(SnsError::UnsupportedTld)
        ));
    }

    #[test]
    fn parse_sns_domain_accepts_canonical_names() {
        assert_eq!(parse_sns_domain("mydomain.sns").unwrap(), "mydomain");
        assert_eq!(parse_sns_domain("sub.mydomain.sns").unwrap(), "sub.mydomain");
    }

    #[test]
    fn parse_sns_domain_rejects_sol_and_bare() {
        assert!(matches!(
            parse_sns_domain("mydomain.sol"),
            Err(SnsError::UnsupportedTld)
        ));
        assert!(matches!(
            parse_sns_domain("mydomain"),
            Err(SnsError::UnsupportedTld)
        ));
    }

    #[test]
    fn parse_sns_domain_rejects_non_canonical() {
        assert!(matches!(
            parse_sns_domain("MyDomain.sns"),
            Err(SnsError::InvalidDomainCasing)
        ));
        // Leading whitespace survives the `.sns` strip and fails the canonical check.
        assert!(matches!(
            parse_sns_domain(" mydomain.sns"),
            Err(SnsError::InvalidDomainCasing)
        ));
    }

    #[test]
    fn parse_sns_domain_rejects_malformed_labels() {
        assert!(matches!(
            parse_sns_domain("a.b.c.sns"),
            Err(SnsError::InvalidDomain)
        ));
        assert!(matches!(
            parse_sns_domain(".mydomain.sns"),
            Err(SnsError::InvalidDomain)
        ));
    }

    #[test]
    fn parse_sns_top_level_domain_accepts_top_level_only() {
        assert_eq!(parse_sns_top_level_domain("mydomain.sns").unwrap(), "mydomain");
    }

    #[test]
    fn parse_sns_top_level_domain_rejects_subdomains() {
        assert!(matches!(
            parse_sns_top_level_domain("sub.mydomain.sns"),
            Err(SnsError::SubdomainNotAllowed)
        ));
    }

    #[test]
    fn parse_sns_top_level_domain_rejects_sol_bare_and_casing() {
        assert!(matches!(
            parse_sns_top_level_domain("mydomain.sol"),
            Err(SnsError::UnsupportedTld)
        ));
        assert!(matches!(
            parse_sns_top_level_domain("mydomain"),
            Err(SnsError::UnsupportedTld)
        ));
        assert!(matches!(
            parse_sns_top_level_domain("MyDomain.sns"),
            Err(SnsError::InvalidDomainCasing)
        ));
        assert!(matches!(
            parse_sns_top_level_domain(".sns"),
            Err(SnsError::InvalidDomain)
        ));
    }
}
