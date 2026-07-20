use super::{decode_injective_address, Record};
use crate::error::SnsError;
use {
    bech32,
    bech32::ToBase32,
    ed25519_dalek,
    solana_program::pubkey::Pubkey,
    std::net::{Ipv4Addr, Ipv6Addr},
};

pub fn check_sol_record(
    record: &[u8],
    signed_record: &[u8],
    pubkey: Pubkey,
) -> Result<bool, SnsError> {
    let key = ed25519_dalek::PublicKey::from_bytes(&pubkey.to_bytes())?;
    let sig = ed25519_dalek::Signature::from_bytes(signed_record)?;
    let res = key.verify_strict(record, &sig).is_ok();
    Ok(res)
}

pub(crate) fn check_sol_record_v1_data(
    record_data: &[u8],
    record_key: &Pubkey,
    registry_owner: &Pubkey,
) -> Result<Option<Pubkey>, SnsError> {
    let payload = record_data.get(..96).ok_or(SnsError::InvalidRecordData)?;
    let record = [&payload[..32], &record_key.to_bytes()].concat();
    let sig = &payload[32..];
    let encoded = hex::encode(record);
    if check_sol_record(encoded.as_bytes(), sig, *registry_owner)? {
        let bytes: [u8; 32] = payload[0..32]
            .try_into()
            .map_err(|_| SnsError::InvalidPubkey)?;
        return Ok(Some(Pubkey::new_from_array(bytes)));
    }
    Ok(None)
}

pub fn get_record_size(record: Record) -> Option<usize> {
    match record {
        Record::Sol => Some(96),
        Record::Eth | Record::Bsc | Record::Injective => Some(20),
        Record::A => Some(4),
        Record::AAAA => Some(16),
        _ => None,
    }
}

pub fn deserialize_record(
    data: &[u8],
    record: Record,
    record_key: &Pubkey,
) -> Result<String, SnsError> {
    let Some(size) = get_record_size(record) else {
        let des = String::from_utf8(data.to_vec())?
            .trim_end_matches('\0')
            .to_string();
        return Ok(des);
    };

    let idx = data
        .iter()
        .rposition(|&byte| byte != 0)
        .map_or(0, |pos| pos + 1);

    // Preserve legacy textual records before classifying fixed-width binary data.
    if let Ok(address) = std::str::from_utf8(&data[..idx]) {
        let valid_legacy = match record {
            Record::Injective => decode_injective_address(address).is_ok(),
            Record::Eth | Record::Bsc => {
                if let (Some(prefix), Some(hex)) = (address.get(..2), address.get(2..)) {
                    prefix == "0x" && matches!(hex::decode(hex), Ok(decoded) if decoded.len() == 20)
                } else {
                    false
                }
            }
            Record::A => address.parse::<Ipv4Addr>().is_ok(),
            Record::AAAA => address.parse::<Ipv6Addr>().is_ok(),
            _ => false,
        };
        if valid_legacy {
            return Ok(address.to_string());
        }
    }

    let payload = data.get(..size).ok_or(SnsError::InvalidRecordData)?;
    if data[size..].iter().any(|byte| *byte != 0) {
        return Err(SnsError::InvalidRecordData);
    }

    match record {
        Record::Sol => {
            let signature = payload.get(32..96).ok_or(SnsError::InvalidRecordData)?;
            let dst = payload.get(..32).ok_or(SnsError::InvalidRecordData)?;
            let expected = [dst, &record_key.to_bytes()].concat();
            let valid = check_sol_record(&expected, signature, *record_key)?;
            if valid {
                let bytes: [u8; 32] = dst.try_into().map_err(|_| SnsError::InvalidRecordData)?;
                let pubkey = Pubkey::new_from_array(bytes);
                return Ok(pubkey.to_string());
            }
        }
        Record::Eth | Record::Bsc => {
            let des = format!("0x{}", hex::encode(payload));
            return Ok(des);
        }
        Record::Injective => {
            let des = bech32::encode("inj", payload.to_base32(), bech32::Variant::Bech32)?;
            return Ok(des);
        }
        Record::A => {
            let bytes: [u8; 4] = payload
                .try_into()
                .map_err(|_| SnsError::InvalidRecordData)?;
            let ip = Ipv4Addr::from(bytes);
            return Ok(ip.to_string());
        }
        Record::AAAA => {
            let bytes: [u8; 16] = payload
                .try_into()
                .map_err(|_| SnsError::InvalidRecordData)?;
            let ip = Ipv6Addr::from(bytes);
            return Ok(ip.to_string());
        }
        _ => {}
    }

    Err(SnsError::InvalidRecordData)
}

pub fn serialize_record(content: &str, record: Record) -> Result<Vec<u8>, SnsError> {
    let size = get_record_size(record);

    if size.is_none() {
        match record {
            Record::CNAME | Record::TXT => {
                let encoded = punycode::encode(content).map_err(|_| SnsError::Punycode)?;
                return Ok(encoded.as_bytes().to_vec());
            }
            _ => return Ok(content.as_bytes().to_vec()),
        };
    }

    match record {
        Record::Eth | Record::Bsc => {
            if !content.starts_with("0x") {
                return Err(SnsError::InvalidEvmAddress);
            }
            let decoded = hex::decode(content.get(2..).ok_or(SnsError::InvalidEvmAddress)?)?;
            if decoded.len() != 20 {
                return Err(SnsError::InvalidEvmAddress);
            }
            Ok(decoded)
        }
        Record::Injective => decode_injective_address(content),
        Record::A => {
            let ip = content
                .parse::<Ipv4Addr>()
                .map_err(|_| SnsError::InvalidIpv4)?;
            Ok(ip.octets().to_vec())
        }
        Record::AAAA => {
            let ip = content
                .parse::<Ipv6Addr>()
                .map_err(|_| SnsError::InvalidIpv6)?;
            Ok(ip.octets().to_vec())
        }
        Record::Sol => Err(SnsError::SolRecordNotSupported),
        _ => unreachable!(),
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use ed25519_dalek::Signer;
    #[test]
    fn test_serialize_record() {
        let data = serialize_record(
            "inj1l3vt52kqzlvpaw2wfug45qkyncflq8hgr5nem7",
            Record::Injective,
        )
        .unwrap();
        assert_eq!(
            data,
            [
                252, 88, 186, 42, 192, 23, 216, 30, 185, 78, 79, 17, 90, 2, 196, 158, 19, 240, 30,
                232,
            ]
            .to_vec()
        );
        let data = serialize_record("192.168.0.1", Record::A).unwrap();
        assert_eq!(data, [192, 168, 0, 1].to_vec());
    }

    #[test]
    fn deserialize_fixed_width_records_uses_exact_prefix() {
        let ipv4 = vec![192, 168, 1, 0];
        let ipv6 = vec![0x20, 0x01, 0x0d, 0xb8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let evm = (0u8..20).collect::<Vec<_>>();
        let injective = (1u8..=19).chain([0]).collect::<Vec<_>>();
        let record_key = Pubkey::default();

        for (record, data, expected) in [
            (Record::A, ipv4, "192.168.1.0".to_string()),
            (
                Record::AAAA,
                ipv6.clone(),
                Ipv6Addr::from(<[u8; 16]>::try_from(ipv6.as_slice()).unwrap()).to_string(),
            ),
            (Record::Eth, evm.clone(), format!("0x{}", hex::encode(evm))),
            (
                Record::Injective,
                injective.clone(),
                bech32::encode("inj", injective.to_base32(), bech32::Variant::Bech32).unwrap(),
            ),
        ] {
            assert_eq!(
                deserialize_record(&data, record, &record_key).unwrap(),
                expected
            );
            let mut padded = data;
            padded.extend_from_slice(&[0; 8]);
            assert_eq!(
                deserialize_record(&padded, record, &record_key).unwrap(),
                expected
            );
        }

        let secret = ed25519_dalek::SecretKey::from_bytes(&[7u8; 32]).unwrap();
        let public = ed25519_dalek::PublicKey::from(&secret);
        let keypair = ed25519_dalek::Keypair { secret, public };
        let record_key = Pubkey::new_from_array(keypair.public.to_bytes());
        let destination = [9u8; 32];
        let message = [destination.as_slice(), record_key.as_ref()].concat();
        let mut signed = destination.to_vec();
        signed.extend_from_slice(&keypair.sign(&message).to_bytes());
        let expected = Pubkey::new_from_array(destination).to_string();
        assert_eq!(
            deserialize_record(&signed, Record::Sol, &record_key).unwrap(),
            expected
        );
        signed.extend_from_slice(&[0; 8]);
        assert_eq!(
            deserialize_record(&signed, Record::Sol, &record_key).unwrap(),
            expected
        );
    }

    #[test]
    fn deserialize_fixed_width_records_preserves_legacy_text() {
        let record_key = Pubkey::default();
        for (record, address) in [
            (Record::A, "192.168.0.1"),
            (Record::AAAA, "::1"),
            (Record::Eth, "0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6"),
            (
                Record::Injective,
                "inj1l3vt52kqzlvpaw2wfug45qkyncflq8hgr5nem7",
            ),
        ] {
            let mut data = address.as_bytes().to_vec();
            data.extend_from_slice(&[0; 32]);
            assert_eq!(
                deserialize_record(&data, record, &record_key).unwrap(),
                address
            );
        }
    }

    #[test]
    fn deserialize_fixed_width_records_rejects_bad_lengths_without_panicking() {
        let record_key = Pubkey::default();
        for (record, width) in [
            (Record::A, 4),
            (Record::AAAA, 16),
            (Record::Eth, 20),
            (Record::Injective, 20),
            (Record::Sol, 96),
        ] {
            for len in [width - 1, width, width + 1] {
                let data = vec![0xff; len];
                assert!(
                    std::panic::catch_unwind(|| {
                        let _ = deserialize_record(&data, record, &record_key);
                    })
                    .is_ok(),
                    "{record:?} length {len}"
                );
            }

            for data in [vec![0xff; width - 1], vec![0xff; width + 1]] {
                assert!(
                    matches!(
                        deserialize_record(&data, record, &record_key),
                        Err(SnsError::InvalidRecordData)
                    ),
                    "{record:?} length {}",
                    data.len()
                );
            }
        }
    }
}
