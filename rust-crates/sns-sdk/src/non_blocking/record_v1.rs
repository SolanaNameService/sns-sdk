use solana_client::nonblocking::rpc_client::RpcClient;
use spl_name_service::state::NameRecordHeader;

use crate::{
    error::SnsError,
    non_blocking::resolve::resolve_name_registry,
    record::{get_record_key, Record, RecordVersion},
};

pub async fn get_record(
    rpc_client: &RpcClient,
    domain: &str,
    record: Record,
) -> Result<Option<(NameRecordHeader, Vec<u8>)>, SnsError> {
    let key = get_record_key(domain, record, RecordVersion::V1)?;
    resolve_name_registry(rpc_client, &key).await
}
