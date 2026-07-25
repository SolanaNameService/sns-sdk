use crate::{
    derivation::{derive, get_prefix, get_sns_domain_key, Domain},
    error::SnsError,
};
use sns_records::state::validation::Validation;
use solana_program::pubkey;
use {bech32::FromBase32, solana_program::pubkey::Pubkey};
pub mod record_v1;
pub mod record_v2;

#[cfg(not(feature = "devnet"))]
pub const CENTRAL_STATE_RECORD_V2: Pubkey = pubkey!("2pMnqHvei2N5oDcVGCRdZx48gqti199wr5CsyTTafsbo");
#[cfg(feature = "devnet")]
pub const CENTRAL_STATE_RECORD_V2: Pubkey = pubkey!("9Wo9amAUKvrHXSSwg9HXY28miHH3sh2TQhxNgYiewkpg");

#[derive(Copy, Clone, Debug)]
pub enum Record {
    Ipfs,
    Arwv,
    Sol,
    Eth,
    Btc,
    Ltc,
    Doge,
    Email,
    Url,
    Discord,
    Github,
    Reddit,
    Twitter,
    Telegram,
    Pic,
    Shdw,
    Point,
    Bsc,
    Injective,
    Backpack,
    A,
    AAAA,
    CNAME,
    TXT,
    BASE,
    Bio,
}

#[derive(Copy, Clone, Debug)]
pub enum RecordVersion {
    V1 = 1,
    V2 = 2,
}

impl Record {
    pub fn as_str(&self) -> &'static str {
        match self {
            Record::Ipfs => "IPFS",
            Record::Arwv => "ARWV",
            Record::Sol => "SOL",
            Record::Eth => "ETH",
            Record::Btc => "BTC",
            Record::Ltc => "LTC",
            Record::Doge => "DOGE",
            Record::Email => "email",
            Record::Url => "url",
            Record::Discord => "discord",
            Record::Github => "github",
            Record::Reddit => "reddit",
            Record::Twitter => "twitter",
            Record::Telegram => "telegram",
            Record::Pic => "pic",
            Record::Shdw => "SHDW",
            Record::Point => "POINT",
            Record::Bsc => "BSC",
            Record::Injective => "INJ",
            Record::Backpack => "backpack",
            Record::A => "A",
            Record::AAAA => "AAAA",
            Record::CNAME => "CNAME",
            Record::TXT => "TXT",
            Record::BASE => "BASE",
            Record::Bio => "bio",
        }
    }

    pub fn try_from_str(input: &str) -> Result<Record, SnsError> {
        match input {
            "IPFS" => Ok(Record::Ipfs),
            "ARWV" => Ok(Record::Arwv),
            "SOL" => Ok(Record::Sol),
            "ETH" => Ok(Record::Eth),
            "BTC" => Ok(Record::Btc),
            "LTC" => Ok(Record::Ltc),
            "DOGE" => Ok(Record::Doge),
            "email" => Ok(Record::Email),
            "url" => Ok(Record::Url),
            "discord" => Ok(Record::Discord),
            "github" => Ok(Record::Github),
            "reddit" => Ok(Record::Reddit),
            "twitter" => Ok(Record::Twitter),
            "telegram" => Ok(Record::Telegram),
            "pic" => Ok(Record::Pic),
            "SHDW" => Ok(Record::Shdw),
            "POINT" => Ok(Record::Point),
            "BSC" => Ok(Record::Bsc),
            "INJ" => Ok(Record::Injective),
            "backpack" => Ok(Record::Backpack),
            "A" => Ok(Record::A),
            "AAAA" => Ok(Record::AAAA),
            "CNAME" => Ok(Record::CNAME),
            "TXT" => Ok(Record::TXT),
            "BASE" => Ok(Record::BASE),
            "bio" => Ok(Record::Bio),
            _ => Err(SnsError::UnrecognizedRecord),
        }
    }

    pub fn utf8_encoded(&self) -> bool {
        matches!(
            self,
            Record::Ipfs
                | Record::Arwv
                | Record::Ltc
                | Record::Doge
                | Record::Email
                | Record::Url
                | Record::Discord
                | Record::Github
                | Record::Reddit
                | Record::Twitter
                | Record::Telegram
                | Record::Pic
                | Record::Shdw
                | Record::Point
                | Record::Backpack
                | Record::TXT
                | Record::CNAME
                | Record::Bio
        )
    }

    pub fn roa_validation(&self) -> Validation {
        match self {
            Record::Sol | Record::CNAME | Record::Url => Validation::Solana,
            Record::Injective | Record::Eth | Record::Bsc | Record::BASE => Validation::Ethereum,
            _ => Validation::None,
        }
    }
}

pub fn get_record_class(record_version: RecordVersion) -> Option<Pubkey> {
    match record_version {
        RecordVersion::V2 => Some(CENTRAL_STATE_RECORD_V2),
        _ => None,
    }
}

pub fn get_record_key(
    domain: &str,
    record: Record,
    record_version: RecordVersion,
) -> Result<Pubkey, SnsError> {
    let domain_key = get_sns_domain_key(domain)?.key;
    let record_prefix = get_prefix(Domain::Record(record_version));
    Ok(derive(
        &format!("{record_prefix}{}", record.as_str()),
        &domain_key,
        get_record_class(record_version),
    ))
}

pub fn get_record_v2_key(domain: &str, record: Record) -> Result<Pubkey, SnsError> {
    get_record_key(domain, record, RecordVersion::V2)
}

pub fn get_record_v1_key(domain: &str, record: Record) -> Result<Pubkey, SnsError> {
    get_record_key(domain, record, RecordVersion::V1)
}

pub(crate) fn decode_injective_address(content: &str) -> Result<Vec<u8>, SnsError> {
    let (hrp, data, variant) = bech32::decode(content)?;
    if hrp != "inj" || variant != bech32::Variant::Bech32 {
        return Err(SnsError::InvalidInjectiveAddress);
    }
    let decoded = Vec::<u8>::from_base32(&data)?;
    if decoded.len() != 20 {
        return Err(SnsError::InvalidInjectiveAddress);
    }
    Ok(decoded)
}

#[cfg(test)]
mod test {
    use super::*;
    use bech32::ToBase32;
    use solana_sdk::pubkey;

    type InjectiveSerializer = fn(&str, Record) -> Result<Vec<u8>, SnsError>;

    fn assert_injective_serializer(
        version: &str,
        serialize: InjectiveSerializer,
        valid: &str,
        payload: &[u8; 20],
    ) {
        assert_eq!(
            serialize(valid, Record::Injective).unwrap(),
            payload,
            "{version}"
        );

        for address in [
            bech32::encode("injfoo", payload.to_base32(), bech32::Variant::Bech32).unwrap(),
            bech32::encode("eth", payload.to_base32(), bech32::Variant::Bech32).unwrap(),
            bech32::encode("inj", payload.to_base32(), bech32::Variant::Bech32m).unwrap(),
            bech32::encode("inj", [0x2au8; 19].to_base32(), bech32::Variant::Bech32).unwrap(),
            bech32::encode("inj", [0x2au8; 21].to_base32(), bech32::Variant::Bech32).unwrap(),
        ] {
            assert!(
                matches!(
                    serialize(&address, Record::Injective),
                    Err(SnsError::InvalidInjectiveAddress)
                ),
                "{version}: {address}"
            );
        }

        let mut invalid_checksum = valid.as_bytes().to_vec();
        let last = invalid_checksum.last_mut().unwrap();
        *last = if *last == b'q' { b'p' } else { b'q' };
        let invalid_checksum = String::from_utf8(invalid_checksum).unwrap();
        assert!(
            matches!(
                serialize(&invalid_checksum, Record::Injective),
                Err(SnsError::Bech32(_))
            ),
            "{version}"
        );
    }

    #[test]
    fn test_get_record_key() {
        #[cfg(not(feature = "devnet"))]
        let v1 = pubkey!("3RfzNCvEqEKZeohqVN16Z1oi6rw5TrANwqAo4hMx6njv");
        #[cfg(feature = "devnet")]
        let v1 = pubkey!("AiPAgK4QKZ3B9poxGyxVoS6W2U5v4R6Vsq4qU29Sez9X");
        #[cfg(not(feature = "devnet"))]
        let v2 = pubkey!("6xdnfxf7URWom6oP7MMS39bFVEMMfufmFvJXFyd2xwoP");
        #[cfg(feature = "devnet")]
        let v2 = pubkey!("9ivrZAtBSviRfW6iVfpYihKPrpp162d4km4t6NiJiLHJ");
        let domain = "something";
        assert_eq!(
            get_record_key(domain, Record::CNAME, RecordVersion::V1).unwrap(),
            v1
        );
        assert_eq!(
            get_record_key(domain, Record::CNAME, RecordVersion::V2).unwrap(),
            v2
        );
    }

    #[test]
    fn injective_serializers_require_canonical_addresses() {
        let payload = [0x2au8; 20];
        let valid = bech32::encode("inj", payload.to_base32(), bech32::Variant::Bech32).unwrap();
        assert_injective_serializer("v1", record_v1::serialize_record, &valid, &payload);
        assert_injective_serializer(
            "v2",
            record_v2::serialize_record_v2_content,
            &valid,
            &payload,
        );

        assert_eq!(
            record_v1::deserialize_record(&payload, Record::Injective, &Pubkey::default()).unwrap(),
            valid
        );
        assert_eq!(
            record_v2::deserialize_record_v2_content(&payload, Record::Injective).unwrap(),
            valid
        );
    }
}
