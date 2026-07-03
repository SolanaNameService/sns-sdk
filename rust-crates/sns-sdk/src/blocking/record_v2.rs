use solana_client::rpc_client::RpcClient;
use solana_program::{program_pack::Pack, pubkey::Pubkey};
use spl_name_service::state::NameRecordHeader;

use crate::{
    blocking::resolve::resolve_name_registry,
    error::SnsError,
    record::{get_record_key, Record, RecordVersion},
};

pub fn get_record_v2(
    rpc_client: &RpcClient,
    record: Record,
    domain: &str,
) -> Result<Option<(NameRecordHeader, Vec<u8>)>, SnsError> {
    let record_key = get_record_key(domain, record, RecordVersion::V2)?;
    resolve_name_registry(rpc_client, &record_key)
}

pub fn get_multiple_records_v2(
    rpc_client: &RpcClient,
    records: &[Record],
    domain: &str,
) -> Result<Vec<Option<(NameRecordHeader, Vec<u8>)>>, SnsError> {
    let pubkeys: Vec<Pubkey> = records
        .iter()
        .map(|r| get_record_key(domain, *r, RecordVersion::V2))
        .collect::<Result<Vec<_>, _>>()?;

    let mut res = vec![];
    for keys in pubkeys.chunks(100) {
        let accs = rpc_client.get_multiple_accounts(keys)?;
        for acc in accs {
            if let Some(acc) = acc {
                let header =
                    NameRecordHeader::unpack_unchecked(&acc.data[0..NameRecordHeader::LEN])?;
                let data = acc.data[NameRecordHeader::LEN..].to_vec();
                res.push(Some((header, data)));
            } else {
                res.push(None);
            }
        }
    }
    Ok(res)
}
