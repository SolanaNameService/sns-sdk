use super::super::*;
use dotenv::dotenv;
use solana_program::pubkey;

fn live_client() -> RpcClient {
    dotenv().ok();
    RpcClient::new(std::env::var("RPC_URL").unwrap())
}

#[test]
fn resolves_sol_ip_5_fixtures_from_rpc() {
    let client = live_client();
    let system_program = solana_program::system_program::ID;
    let cases = [
        (
            "sns-ip-5-wallet-1.sol",
            pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
            AllowPda::Deny,
        ),
        (
            "sns-ip-5-wallet-2.sol",
            pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
            AllowPda::Deny,
        ),
        (
            "sns-ip-5-wallet-3.sol",
            pubkey!("96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr"),
            AllowPda::Allow(vec![system_program]),
        ),
        (
            "sns-ip-5-wallet-5.sol",
            pubkey!("96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr"),
            AllowPda::Allow(vec![system_program]),
        ),
        (
            "sns-ip-5-wallet-7.sol",
            pubkey!("53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH"),
            AllowPda::Deny,
        ),
        (
            "sns-ip-5-wallet-9.sol",
            pubkey!("53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH"),
            AllowPda::Deny,
        ),
    ];

    for (domain, expected, allow_pda) in cases {
        let result = resolve(&client, domain, allow_pda).unwrap();
        assert_eq!(result, expected, "domain {domain}");
    }
}

#[test]
fn returns_expected_sol_fixture_errors_from_rpc() {
    let client = live_client();

    let domain = "sns-ip-5-wallet-3.sol";
    assert!(matches!(
        resolve(&client, domain, AllowPda::Deny),
        Err(SnsError::PdaOwnerNotAllowed)
    ));

    for domain in [
        "sns-ip-5-wallet-4.sol",
        "sns-ip-5-wallet-6.sol",
        "sns-ip-5-wallet-8.sol",
    ] {
        assert!(matches!(
            resolve(&client, domain, AllowPda::Deny),
            Err(SnsError::DomainExpired)
        ));
    }

    let domain = "sns-ip-5-wallet-5.sol";
    assert!(matches!(
        resolve(&client, domain, AllowPda::Deny),
        Err(SnsError::PdaOwnerNotAllowed)
    ));
}

#[test]
fn safe_resolves_sol_ip_5_fixtures_from_rpc() {
    let client = live_client();
    let system_program = solana_program::system_program::ID;
    let cases = [
        (
            "sns-ip-5-wallet-1.sol",
            pubkey!("ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs"),
            AllowPda::Deny,
        ),
        (
            "sns-ip-5-wallet-5.sol",
            pubkey!("96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr"),
            AllowPda::Allow(vec![system_program]),
        ),
        (
            "sns-ip-5-wallet-7.sol",
            pubkey!("53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH"),
            AllowPda::Deny,
        ),
    ];

    for (domain, expected, allow_pda) in cases {
        let result = safe_resolve(&client, domain, allow_pda).unwrap();
        assert_eq!(result, expected, "domain {domain}");
    }
}

#[test]
fn returns_expected_safe_sol_fixture_errors_from_rpc() {
    let client = live_client();

    for domain in ["sns-ip-5-wallet-2.sol", "sns-ip-5-wallet-9.sol"] {
        assert!(matches!(
            safe_resolve(&client, domain, AllowPda::Deny),
            Err(SnsError::SnsSolResolutionMismatch)
        ));
    }

    for domain in [
        "sns-ip-5-wallet-4.sol",
        "sns-ip-5-wallet-6.sol",
        "sns-ip-5-wallet-8.sol",
    ] {
        assert!(matches!(
            safe_resolve(&client, domain, AllowPda::Deny),
            Err(SnsError::DomainExpired)
        ));
    }

    let domain = "sns-ip-5-wallet-5.sol";
    assert!(matches!(
        safe_resolve(&client, domain, AllowPda::Deny),
        Err(SnsError::PdaOwnerNotAllowed)
    ));
}
