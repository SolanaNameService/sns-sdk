use solana_client::nonblocking::rpc_client::RpcClient;
use solana_program::pubkey::Pubkey;
use spl_name_service::state::NameRecordHeader;

use crate::{
    error::SnsError,
    non_blocking::resolve::{resolve_name_registry, resolve_name_registry_batch},
    record::{get_record_key, Record, RecordVersion},
};

pub async fn get_record_v2(
    rpc_client: &RpcClient,
    record: Record,
    domain: &str,
) -> Result<Option<(NameRecordHeader, Vec<u8>)>, SnsError> {
    let record_key = get_record_key(domain, record, RecordVersion::V2)?;
    resolve_name_registry(rpc_client, &record_key).await
}

pub async fn get_multiple_records_v2(
    rpc_client: &RpcClient,
    records: &[Record],
    domain: &str,
) -> Result<Vec<Option<(NameRecordHeader, Vec<u8>)>>, SnsError> {
    let pubkeys: Vec<Pubkey> = records
        .iter()
        .map(|r| get_record_key(domain, *r, RecordVersion::V2))
        .collect::<Result<Vec<_>, _>>()?;
    resolve_name_registry_batch(rpc_client, &pubkeys).await
}
