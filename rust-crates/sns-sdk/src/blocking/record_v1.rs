use solana_client::rpc_client::RpcClient;
use spl_name_service::state::NameRecordHeader;

use crate::{
    blocking::resolve::resolve_name_registry,
    error::SnsError,
    record::{get_record_key, Record, RecordVersion},
};

pub fn get_record(
    rpc_client: &RpcClient,
    domain: &str,
    record: Record,
) -> Result<Option<(NameRecordHeader, Vec<u8>)>, SnsError> {
    let key = get_record_key(domain, record, RecordVersion::V1)?;
    resolve_name_registry(rpc_client, &key)
}
