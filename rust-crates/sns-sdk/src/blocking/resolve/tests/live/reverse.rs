use super::super::*;
use dotenv::dotenv;
use solana_program::pubkey;

#[test]
fn resolves_reverse_record_from_rpc() {
    dotenv().ok();
    let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
    let key: Pubkey = pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb");
    let reverse = resolve_reverse(&client, &key).unwrap();
    assert_eq!(reverse.unwrap(), "bonfida");
}
