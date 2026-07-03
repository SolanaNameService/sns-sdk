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

#[cfg(test)]
mod tests {
    use super::*;
    use dotenv::dotenv;

    #[test]
    fn test_get_record() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        let res = get_record(&client, "bonfida.sns", Record::Url).unwrap();
        assert_eq!(
            String::from_utf8(res.unwrap().1)
                .unwrap()
                .trim_end_matches('\0'),
            "https://sns.id"
        );

        let res = get_record(&client, "bonfida.sns", Record::Backpack).unwrap();
        assert!(res.is_none())
    }
}
