use super::super::*;
use dotenv::dotenv;
use solana_program::pubkey;

#[tokio::test]
async fn resolves_reverse_record_from_rpc() {
    dotenv().ok();
    let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
    let key: Pubkey = pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb");
    let reverse = resolve_reverse(&client, &key).await.unwrap();
    assert_eq!(reverse.unwrap(), "bonfida");
}

#[tokio::test]
async fn resolves_reverse_records_in_batch_from_rpc() {
    dotenv().ok();
    let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
    let reverses = resolve_reverse_batch(
        &client,
        &[
            pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"),
            pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"),
        ],
    )
    .await
    .unwrap();
    assert_eq!(
        reverses,
        vec![Some("bonfida".to_string()), Some("bonfida".to_string())]
    )
}
