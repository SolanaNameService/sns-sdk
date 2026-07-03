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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::record::record_v1::deserialize_record;
    use dotenv::dotenv;
    use solana_program::pubkey::Pubkey;

    #[tokio::test]
    async fn test_get_record() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        let res = get_record(&client, "bonfida.sns", Record::Url)
            .await
            .unwrap();
        assert_eq!(
            deserialize_record(&res.unwrap().1, Record::Url, &Pubkey::default()).unwrap(),
            "https://sns.id"
        );

        let res = get_record(&client, "bonfida.sns", Record::Backpack)
            .await
            .unwrap();
        assert!(res.is_none());

        let res = get_record(&client, "🍍.sns", Record::Eth).await.unwrap();
        assert_eq!(
            deserialize_record(&res.unwrap().1, Record::Eth, &Pubkey::default()).unwrap(),
            "0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6"
        );
    }
}
