use solana_client::nonblocking::rpc_client::RpcClient;
use solana_program::pubkey::Pubkey;
use spl_name_service::state::NameRecordHeader;

use crate::{
    error::SnsError,
    non_blocking::resolve::{resolve_name_registry, resolve_name_registry_batch},
    non_blocking::tld::assert_tld_supported,
    record::{get_record_key, Record, RecordVersion},
};

pub async fn get_record_v2(
    rpc_client: &RpcClient,
    domain: &str,
    record: Record,
) -> Result<Option<(NameRecordHeader, Vec<u8>)>, SnsError> {
    let (domain, _) = assert_tld_supported(rpc_client, domain).await?;
    let record_key = get_record_key(domain, record, RecordVersion::V2)?;
    resolve_name_registry(rpc_client, &record_key).await
}

pub async fn get_multiple_records_v2(
    rpc_client: &RpcClient,
    domain: &str,
    records: &[Record],
) -> Result<Vec<Option<(NameRecordHeader, Vec<u8>)>>, SnsError> {
    let (domain, _) = assert_tld_supported(rpc_client, domain).await?;
    let pubkeys: Vec<Pubkey> = records
        .iter()
        .map(|r| get_record_key(domain, *r, RecordVersion::V2))
        .collect::<Result<Vec<_>, _>>()?;
    resolve_name_registry_batch(rpc_client, &pubkeys).await
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_record_v2_getters_reject_bare_domains() {
        let client = RpcClient::new(String::new());
        assert!(matches!(
            get_record_v2(&client, "mydomain", Record::Github).await,
            Err(SnsError::UnsupportedTld)
        ));
        assert!(matches!(
            get_multiple_records_v2(&client, "mydomain", &[Record::Github]).await,
            Err(SnsError::UnsupportedTld)
        ));
    }

    #[cfg(not(feature = "devnet"))]
    mod mainnet {
        use super::*;
        use crate::{
            derivation::get_sns_domain_key, non_blocking::nft::resolve_nft_owner,
            record::record_v2::decode_record_v2_fields, tld::parse_supported_tld,
        };
        use dotenv::dotenv;

        const RECORD_FIXTURES: [(Record, &str, bool); 3] = [
            (Record::Ipfs, "ipfs://test", true),
            (Record::Email, "test@gmail.com", false),
            (Record::Url, "https://google.com", false),
        ];

        fn client() -> RpcClient {
            dotenv().ok();
            RpcClient::new(std::env::var("RPC_URL").unwrap())
        }

        async fn effective_domain_owner(rpc_client: &RpcClient, domain: &str) -> Pubkey {
            let (domain, _) = parse_supported_tld(domain).unwrap();
            let domain_key = get_sns_domain_key(domain).unwrap().key;
            let (domain_header, _) = resolve_name_registry(rpc_client, &domain_key)
                .await
                .unwrap()
                .unwrap();
            resolve_nft_owner(rpc_client, &domain_key)
                .await
                .unwrap()
                .unwrap_or(domain_header.owner)
        }

        #[tokio::test]
        async fn test_get_record_v2() {
            let client = client();
            for domain in ["wallet-guide-9.sns", "wallet-guide-9.sol"] {
                let domain_owner = effective_domain_owner(&client, domain).await;
                for (record, expected_content, expected_staleness_verified) in RECORD_FIXTURES {
                    let (_, data) = get_record_v2(&client, domain, record)
                        .await
                        .unwrap()
                        .unwrap();
                    let parsed = decode_record_v2_fields(&data)
                        .unwrap()
                        .parse_content(record)
                        .unwrap();

                    assert_eq!(parsed.content, expected_content, "domain {domain}");
                    assert_eq!(
                        parsed.verify_staleness(domain_owner, None).is_ok(),
                        expected_staleness_verified,
                        "domain {domain}, record {record:?}"
                    );
                }
            }
        }

        #[tokio::test]
        async fn test_get_multiple_records_v2() {
            let client = client();
            let records = RECORD_FIXTURES
                .iter()
                .map(|(record, _, _)| *record)
                .collect::<Vec<_>>();
            for domain in ["wallet-guide-9.sns", "wallet-guide-9.sol"] {
                let result = get_multiple_records_v2(&client, domain, &records)
                    .await
                    .unwrap();
                let domain_owner = effective_domain_owner(&client, domain).await;

                for (i, item) in result.into_iter().enumerate() {
                    let (record, expected_content, expected_staleness_verified) =
                        RECORD_FIXTURES[i];
                    let (_, data) = item.unwrap();
                    let parsed = decode_record_v2_fields(&data)
                        .unwrap()
                        .parse_content(record)
                        .unwrap();

                    assert_eq!(parsed.content, expected_content, "domain {domain}");
                    assert_eq!(
                        parsed.verify_staleness(domain_owner, None).is_ok(),
                        expected_staleness_verified,
                        "domain {domain}, record {record:?}"
                    );
                }
            }
        }
    }
}
