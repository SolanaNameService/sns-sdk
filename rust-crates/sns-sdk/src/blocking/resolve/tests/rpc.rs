use super::*;
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

#[test]
fn resolves_sns_domains_from_rpc() {
    dotenv().ok();
    let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

    let res = resolve(&client, "🇺🇸.sns", AllowPda::Deny).unwrap();
    assert_eq!(res, pubkey!("8fe1EFcmz4BYeX6zGp6HUdoaHjVYhzsv599ub52WJbos"));

    let res = resolve(&client, "0xluna.sns", AllowPda::Deny).unwrap();
    assert_eq!(res, pubkey!("8fe1EFcmz4BYeX6zGp6HUdoaHjVYhzsv599ub52WJbos"));

    let res = resolve(&client, "bonfida.sns", AllowPda::Deny).unwrap();
    assert_eq!(res, pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v"));
}

#[test]
fn resolves_sns_ip_5_fixtures_from_rpc() {
    dotenv().ok();
    let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

    let cases = [
        (
            "sns-ip-5-wallet-1",
            pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
        ),
        (
            "sns-ip-5-wallet-2",
            pubkey!("AxwzQXhZNJb9zLyiHUQA12L2GL7CxvUNrp6neee6r3cA"),
        ),
        (
            "sns-ip-5-wallet-4",
            pubkey!("7PLHHJawDoa4PGJUK3mUnusV7SEVwZwEyV5csVzm86J4"),
        ),
        (
            "sns-ip-5-wallet-7",
            pubkey!("53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH"),
        ),
        (
            "sns-ip-5-wallet-8",
            pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
        ),
        (
            "sns-ip-5-wallet-9",
            pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
        ),
        (
            "wallet-guide-5",
            pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
        ),
        (
            "wallet-guide-4",
            pubkey!("Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ"),
        ),
        (
            "wallet-guide-3",
            pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
        ),
        (
            "wallet-guide-2",
            pubkey!("36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"),
        ),
        (
            "wallet-guide-1",
            pubkey!("36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"),
        ),
        (
            "wallet-guide-0",
            pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
        ),
        (
            "sub-0.wallet-guide-3",
            pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
        ),
        (
            "sub-1.wallet-guide-3",
            pubkey!("Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ"),
        ),
        (
            "wallet-guide-6",
            pubkey!("Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ"),
        ),
        (
            "wallet-guide-8",
            pubkey!("36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"),
        ),
    ];

    for (domain, expected) in cases {
        let domain = format!("{domain}.sns");
        let res = resolve(&client, &domain, AllowPda::Deny).unwrap();
        assert_eq!(res, expected, "domain {domain}");
    }
}

#[test]
fn resolves_sns_ip_5_pda_fixtures_from_rpc() {
    dotenv().ok();
    let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
    let expected = pubkey!("96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr");
    let system_program = solana_program::system_program::ID;

    for domain in ["sns-ip-5-wallet-5", "sns-ip-5-wallet-10"] {
        let domain = format!("{domain}.sns");
        let res = resolve(&client, &domain, AllowPda::Allow(vec![system_program])).unwrap();
        assert_eq!(res, expected, "domain {domain} with Allow");

        let res = resolve(&client, &domain, AllowPda::AllowAny).unwrap();
        assert_eq!(res, expected, "domain {domain} with AllowAny");
    }
}

#[test]
fn returns_expected_sns_ip_5_fixture_errors_from_rpc() {
    dotenv().ok();
    let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

    let domain = "sns-ip-5-wallet-3.sns";
    let res = resolve(&client, domain, AllowPda::Deny);
    assert!(
        matches!(res, Err(SnsError::WrongValidation)),
        "{domain}: {res:?}"
    );

    let domain = "sns-ip-5-wallet-12.sns";
    let res = resolve(&client, domain, AllowPda::Deny);
    assert!(
        matches!(res, Err(SnsError::WrongValidation)),
        "{domain}: {res:?}"
    );

    let domain = "sns-ip-5-wallet-6.sns";
    let res = resolve(&client, domain, AllowPda::Deny);
    assert!(
        matches!(res, Err(SnsError::PdaOwnerNotAllowed)),
        "{domain}: {res:?}"
    );

    let domain = "sns-ip-5-wallet-11.sns";
    let res = resolve(&client, domain, AllowPda::Deny);
    assert!(
        matches!(res, Err(SnsError::PdaOwnerNotAllowed)),
        "{domain}: {res:?}"
    );

    let res = resolve(&client, "sns-ip-5-wallet-6.sns", AllowPda::Allow(vec![]));
    assert!(matches!(res, Err(SnsError::PdaOwnerNotAllowed)), "{res:?}");
}
