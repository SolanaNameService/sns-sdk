use borsh::BorshDeserialize;
use sns_records::state::{
    record_header::RecordHeader,
    validation::{get_validation_length, Validation},
};
use solana_program::pubkey;

use super::{convert_u5_array, Record};
use crate::error::SnsError;
use {
    bech32::ToBase32,
    solana_program::pubkey::Pubkey,
    std::net::{Ipv4Addr, Ipv6Addr},
    std::str::FromStr,
};

pub struct ParsedRecordV2<'a> {
    pub record: Record,
    pub header: RecordHeader,
    pub staleness_validation: Validation,
    pub roa_validation: Validation,
    pub roa_id: &'a [u8],
    pub staleness_id: &'a [u8],
    pub content: String,
}

pub const GUARDIAN_ID: Pubkey = pubkey!("ExXjtfdQe8JacoqP9Z535WzQKjF4CzW1TTRKRgpxvya3");

impl<'a> ParsedRecordV2<'a> {
    pub fn verify_staleness(
        &self,
        domain_owner_key: Pubkey,
        domain_owner_account_data: Option<&[u8]>,
    ) -> Result<(), SnsError> {
        if domain_owner_key == sns_warp_common::constants::EMITTER_KEY {
            // The domain is XChain-owned
            if self.header.staleness_validation != Validation::XChain as u16 {
                return Err(SnsError::StaleRecord);
            }
            let domain_owner_account_data =
                domain_owner_account_data.ok_or(SnsError::StaleRecord)?;
            let xchain_record = sns_warp_common::state::x_domain::XDomain::try_from_slice(
                domain_owner_account_data,
            )?;
            let expected_owner_chain = u16::from_le_bytes(
                self.staleness_id
                    .get(..2)
                    .ok_or(SnsError::InvalidRecordData)?
                    .try_into()
                    .map_err(|_| SnsError::InvalidRecordData)?,
            );
            let expected_owner_address = self
                .staleness_id
                .get(2..)
                .ok_or(SnsError::InvalidRecordData)?;
            if expected_owner_chain != xchain_record.owner_chain
                || expected_owner_address != xchain_record.owner_address
            {
                return Err(SnsError::StaleRecord);
            }

            return Ok(());
        }
        if self.header.staleness_validation != Validation::Solana as u16
            || self.staleness_id != domain_owner_key.as_ref()
        {
            return Err(SnsError::StaleRecord);
        }
        Ok(())
    }

    pub fn verify_roa(&self) -> Result<(), SnsError> {
        let validation = self.record.roa_validation();
        if validation as u16 != self.header.right_of_association_validation {
            return Err(SnsError::UnverifiedRecord);
        }
        if matches!(self.record, Record::CNAME | Record::Url) && self.roa_id != GUARDIAN_ID.as_ref()
        {
            return Err(SnsError::UnverifiedRecord);
        }
        Ok(())
    }
}

pub struct RecordV2Fields<'a> {
    pub header: RecordHeader,
    pub staleness_validation: Validation,
    pub roa_validation: Validation,
    pub staleness_id: &'a [u8],
    pub roa_id: &'a [u8],
    pub content_bytes: &'a [u8],
}

impl<'a> RecordV2Fields<'a> {
    pub fn parse_content(self, record: Record) -> Result<ParsedRecordV2<'a>, SnsError> {
        let content = deserialize_record_v2_content(self.content_bytes, record)?;
        Ok(ParsedRecordV2 {
            record,
            header: self.header,
            staleness_validation: self.staleness_validation,
            roa_validation: self.roa_validation,
            roa_id: self.roa_id,
            staleness_id: self.staleness_id,
            content,
        })
    }
}

pub fn decode_record_v2_fields(record_data: &[u8]) -> Result<RecordV2Fields<'_>, SnsError> {
    if record_data.len() < RecordHeader::LEN {
        return Err(SnsError::InvalidRecordData);
    }

    let header = *bytemuck::from_bytes::<RecordHeader>(&record_data[..RecordHeader::LEN]);
    let staleness_validation = Validation::try_from(header.staleness_validation)?;
    let roa_validation = Validation::try_from(header.right_of_association_validation)?;

    // On-chain layout: staleness_id, then roa_id, then content.
    let mut offset = RecordHeader::LEN;
    let staleness_len = get_validation_length(staleness_validation) as usize;
    let staleness_id = record_data
        .get(offset..offset + staleness_len)
        .ok_or(SnsError::InvalidRecordData)?;
    offset += staleness_len;

    let roa_len = get_validation_length(roa_validation) as usize;
    let roa_id = record_data
        .get(offset..offset + roa_len)
        .ok_or(SnsError::InvalidRecordData)?;
    offset += roa_len;

    let content_length = header.content_length as usize;
    let content_bytes = record_data
        .get(offset..offset + content_length)
        .ok_or(SnsError::InvalidRecordData)?;

    Ok(RecordV2Fields {
        header,
        staleness_validation,
        roa_validation,
        staleness_id,
        roa_id,
        content_bytes,
    })
}

pub(crate) fn check_sol_record_v2_data(
    record_data: &[u8],
    registry_owner: &Pubkey,
) -> Result<Option<Pubkey>, SnsError> {
    let record = decode_record_v2_fields(record_data)?;

    if record.content_bytes.len() != 32 {
        return Err(SnsError::RecordMalformed);
    }

    if !matches!(record.staleness_validation, Validation::Solana)
        || !matches!(record.roa_validation, Validation::Solana)
    {
        return Err(SnsError::WrongValidation);
    }

    if record.staleness_id != registry_owner.as_ref() {
        return Ok(None);
    }

    if record.roa_id == record.content_bytes {
        let bytes: [u8; 32] = record
            .content_bytes
            .try_into()
            .map_err(|_| SnsError::InvalidPubkey)?;
        return Ok(Some(Pubkey::new_from_array(bytes)));
    }

    Err(SnsError::InvalidRoa)
}

pub fn deserialize_record_v2_content(content: &[u8], record: Record) -> Result<String, SnsError> {
    match record {
        // UTF-8 encoded record
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
        | Record::Btc
        | Record::CNAME
        | Record::Bio => {
            let decoded = String::from_utf8(content.to_vec())?;
            if matches!(record, Record::CNAME | Record::TXT) {
                let decoded = punycode::decode(&decoded).map_err(|_| SnsError::Punycode)?;
                Ok(decoded)
            } else {
                Ok(decoded)
            }
        }
        Record::Sol => {
            let bytes: [u8; 32] = content.try_into()?;
            let pubkey = Pubkey::new_from_array(bytes);
            Ok(pubkey.to_string())
        }
        Record::Injective => {
            let des = bech32::encode("inj", content.to_base32(), bech32::Variant::Bech32)?;
            Ok(des)
        }
        Record::Bsc | Record::Eth | Record::BASE => {
            let des = format!("0x{}", hex::encode(content));
            Ok(des)
        }
        Record::AAAA => {
            let bytes: [u8; 16] = content.try_into()?;
            let ip = Ipv6Addr::from(bytes);
            Ok(ip.to_string())
        }
        Record::A => {
            let bytes: [u8; 4] = content.try_into()?;
            let ip = Ipv4Addr::from(bytes);
            Ok(ip.to_string())
        }
    }
}

pub fn serialize_record_v2_content(content: &str, record: Record) -> Result<Vec<u8>, SnsError> {
    match record {
        // UTF-8 encoded record
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
        | Record::Btc
        | Record::CNAME
        | Record::Bio => {
            if matches!(record, Record::CNAME | Record::TXT) {
                let encoded = punycode::encode(content).map_err(|_| SnsError::Punycode)?;
                Ok(encoded.as_bytes().to_vec())
            } else {
                Ok(content.as_bytes().to_vec())
            }
        }
        Record::Sol => {
            let pubkey = Pubkey::from_str(content).map_err(|_| SnsError::InvalidPubkey)?;
            Ok(pubkey.to_bytes().to_vec())
        }
        Record::Injective => {
            if !content.starts_with("inj") {
                return Err(SnsError::InvalidInjectiveAddress);
            }
            let (_, data, _) = bech32::decode(content)?;
            let data = convert_u5_array(&data);
            if data.len() != 20 {
                return Err(SnsError::InvalidInjectiveAddress);
            }
            Ok(data)
        }
        Record::Bsc | Record::Eth | Record::BASE => {
            if !content.starts_with("0x") {
                return Err(SnsError::InvalidEvmAddress);
            }
            let decoded = hex::decode(content.get(2..).ok_or(SnsError::InvalidEvmAddress)?)?;
            if decoded.len() != 20 {
                return Err(SnsError::InvalidEvmAddress);
            }
            Ok(decoded)
        }
        Record::AAAA => {
            let ip = content
                .parse::<Ipv6Addr>()
                .map_err(|_| SnsError::InvalidIpv6)?;
            Ok(ip.octets().to_vec())
        }
        Record::A => {
            let ip = content
                .parse::<Ipv4Addr>()
                .map_err(|_| SnsError::InvalidIpv4)?;
            Ok(ip.octets().to_vec())
        }
    }
}

#[cfg(test)]
mod test {

    use crate::{
        derivation::{derive, get_domain_key},
        record::{get_record_v2_key, CENTRAL_STATE_RECORD_V2},
    };

    use super::*;
    #[test]
    fn test_serialize_record_v2_content() {
        let content = "this is a test";
        let buffer = vec![
            116, 104, 105, 115, 32, 105, 115, 32, 97, 32, 116, 101, 115, 116, 45,
        ];
        let ser = serialize_record_v2_content(content, Record::TXT).unwrap();
        assert_eq!(buffer, ser);

        let content = "D8mRVSXrE2uU8KDAKQsGbfBNRyunMrmHBdEMrtWz1cUc";
        let buffer = vec![
            180, 73, 137, 132, 77, 15, 98, 34, 43, 221, 219, 250, 234, 69, 5, 187, 165, 135, 112,
            64, 210, 198, 161, 135, 12, 123, 255, 155, 246, 126, 213, 29,
        ];
        let ser = serialize_record_v2_content(content, Record::Sol).unwrap();
        assert_eq!(buffer, ser)
    }

    #[test]
    fn test_deserialize_record_v2_content() {
        let content = "this is a test";
        let buffer = vec![
            116, 104, 105, 115, 32, 105, 115, 32, 97, 32, 116, 101, 115, 116, 45,
        ];
        let des = deserialize_record_v2_content(&buffer, Record::TXT).unwrap();
        assert_eq!(des, content);

        let content = "D8mRVSXrE2uU8KDAKQsGbfBNRyunMrmHBdEMrtWz1cUc";
        let buffer = vec![
            180, 73, 137, 132, 77, 15, 98, 34, 43, 221, 219, 250, 234, 69, 5, 187, 165, 135, 112,
            64, 210, 198, 161, 135, 12, 123, 255, 155, 246, 126, 213, 29,
        ];
        let des = deserialize_record_v2_content(&buffer, Record::Sol).unwrap();
        assert_eq!(des, content)
    }

    #[test]
    fn test_des_ser() {
        let content = "test";
        let ser = serialize_record_v2_content(content, Record::TXT).unwrap();
        let des = deserialize_record_v2_content(&ser, Record::TXT).unwrap();
        assert_eq!(content, des);

        let content = "192.168.0.0";
        let ser = serialize_record_v2_content(content, Record::A).unwrap();
        let des = deserialize_record_v2_content(&ser, Record::A).unwrap();
        assert_eq!(content, des);
    }

    fn build_v2_record(
        staleness_validation: Validation,
        roa_validation: Validation,
        staleness_id: &[u8],
        roa_id: &[u8],
        content: &[u8],
    ) -> Vec<u8> {
        let mut buf = vec![];
        buf.extend_from_slice(&(staleness_validation as u16).to_le_bytes());
        buf.extend_from_slice(&(roa_validation as u16).to_le_bytes());
        buf.extend_from_slice(&(content.len() as u32).to_le_bytes());
        buf.extend_from_slice(staleness_id);
        buf.extend_from_slice(roa_id);
        buf.extend_from_slice(content);
        buf
    }

    #[test]
    fn decode_record_v2_fields_reads_fields_in_order() {
        let staleness_id = [0x11u8; 32];
        let roa_id = [0x22u8; 32];
        let content = [0x33u8; 32];
        let buf = build_v2_record(
            Validation::Solana,
            Validation::Solana,
            &staleness_id,
            &roa_id,
            &content,
        );

        let fields = decode_record_v2_fields(&buf).unwrap();
        assert!(matches!(fields.staleness_validation, Validation::Solana));
        assert!(matches!(fields.roa_validation, Validation::Solana));
        assert_eq!(fields.staleness_id, &staleness_id);
        assert_eq!(fields.roa_id, &roa_id);
        assert_eq!(fields.content_bytes, &content);

        let parsed = fields.parse_content(Record::Sol).unwrap();
        assert_eq!(parsed.staleness_id, &staleness_id);
        assert_eq!(parsed.roa_id, &roa_id);
        assert_eq!(parsed.content, Pubkey::new_from_array(content).to_string());
    }

    #[test]
    fn decode_record_v2_fields_rejects_truncated_buffer() {
        // Header claims 32-byte staleness/roa/content but only 16 bytes follow.
        let buf = build_v2_record(Validation::Solana, Validation::Solana, &[0u8; 16], &[], &[]);
        let res = decode_record_v2_fields(&buf);
        assert!(matches!(res, Err(SnsError::InvalidRecordData)));
    }

    #[test]
    fn v2_record_key_for_subdomain_matches_domain_key_derivation() {
        let domain = "dex.bonfida.sns";
        let record = Record::Url;
        let domain_key = get_domain_key(domain).unwrap();
        let expected = derive(
            &format!("\x02{}", record.as_str()),
            &domain_key,
            Some(CENTRAL_STATE_RECORD_V2),
        );

        let actual = get_record_v2_key(domain, record).unwrap();

        assert_eq!(actual, expected);
    }
}
