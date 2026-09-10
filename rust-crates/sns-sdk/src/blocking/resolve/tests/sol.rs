use super::fixtures::{srs_account, test_client, TEST_NOW};
use super::*;
use crate::{
    derivation::{get_sol_domain_key, SRS_PROGRAM_ID},
    resolve::{
        get_srs_token_mint, token_2022_holder_account, token_2022_mint_account, SrsRecordOwner,
    },
    utils::test::{account_response, token_largest_accounts_response, TestRpcSender},
};
use solana_client::{rpc_client::RpcClientConfig, rpc_request::RpcRequest};
use solana_program::{pubkey, pubkey::Pubkey};
use solana_sdk::account::Account;
use spl_token_2022::state::AccountState;

fn token_srs_test_client(
    endpoint: &str,
    domain: &str,
    balances: &[(Pubkey, &str)],
    holder_account: Option<&Account>,
    owner_account: Option<&Account>,
) -> (RpcClient, TestRpcSender) {
    let record_key = get_sol_domain_key(domain).key;
    let mint = get_srs_token_mint(&record_key);
    let record = srs_account(SrsRecordOwner::Token(mint));
    let mint_account = token_2022_mint_account(1, 0, true);
    let mut responses = vec![
        (RpcRequest::GetAccountInfo, account_response(Some(&record))),
        (
            RpcRequest::GetAccountInfo,
            account_response(Some(&mint_account)),
        ),
        (
            RpcRequest::GetTokenLargestAccounts,
            token_largest_accounts_response(balances),
        ),
    ];
    if let Some(holder_account) = holder_account {
        responses.push((
            RpcRequest::GetAccountInfo,
            account_response(Some(holder_account)),
        ));
    }
    if let Some(owner_account) = owner_account {
        responses.push((
            RpcRequest::GetAccountInfo,
            account_response(Some(owner_account)),
        ));
    }
    test_client(endpoint, responses)
}

#[test]
fn rejects_missing_srs_record() {
    let (client, sender) = test_client("blocking-srs-missing", []);
    assert!(matches!(
        resolve_with_config(&client, "missing.sol", AllowPda::Deny, TEST_NOW),
        Err(SnsError::DomainDoesNotExist)
    ));
    assert_eq!(sender.requests()[0].0, RpcRequest::GetAccountInfo);
}

#[test]
fn rejects_noncanonical_srs_token_mint() {
    let account = srs_account(SrsRecordOwner::Token(Pubkey::new_unique()));
    let (client, sender) = test_client(
        "blocking-srs-token",
        [(RpcRequest::GetAccountInfo, account_response(Some(&account)))],
    );
    assert!(matches!(
        resolve_with_config(&client, "token.sol", AllowPda::Deny, TEST_NOW),
        Err(SnsError::RecordMalformed)
    ));
    assert_eq!(sender.requests().len(), 1);
}

#[test]
fn resolves_initialized_and_frozen_srs_token_holders() {
    let domain = "token";
    let record_key = get_sol_domain_key(domain).key;
    let mint = get_srs_token_mint(&record_key);
    let holder_key = Pubkey::new_unique();
    let owner = pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");

    for state in [AccountState::Initialized, AccountState::Frozen] {
        let holder = token_2022_holder_account(mint, owner, 1, state);
        let (client, _) = token_srs_test_client(
            &format!("blocking-token-holder-{state:?}"),
            domain,
            &[(holder_key, "1"), (Pubkey::new_unique(), "0")],
            Some(&holder),
            None,
        );
        assert_eq!(
            resolve_with_config(&client, "token.sol", AllowPda::Deny, TEST_NOW).unwrap(),
            owner
        );
    }
}

#[test]
fn rejects_missing_srs_token_mint() {
    let domain = "token";
    let record_key = get_sol_domain_key(domain).key;
    let mint = get_srs_token_mint(&record_key);
    let record = srs_account(SrsRecordOwner::Token(mint));
    let (client, _) = test_client(
        "blocking-token-missing-mint",
        [(RpcRequest::GetAccountInfo, account_response(Some(&record)))],
    );
    assert!(matches!(
        resolve_with_config(&client, "token.sol", AllowPda::Deny, TEST_NOW),
        Err(SnsError::CouldNotFindSrsOwner)
    ));
}

#[test]
fn rejects_zero_or_multiple_srs_token_holders() {
    for (endpoint, balances) in [
        ("blocking-token-no-holder", vec![]),
        (
            "blocking-token-multiple-holders",
            vec![(Pubkey::new_unique(), "1"), (Pubkey::new_unique(), "1")],
        ),
    ] {
        let (client, _) = token_srs_test_client(endpoint, "token", &balances, None, None);
        assert!(matches!(
            resolve_with_config(&client, "token.sol", AllowPda::Deny, TEST_NOW),
            Err(SnsError::CouldNotFindSrsOwner)
        ));
    }
}

#[test]
fn rejects_missing_srs_token_holder() {
    let (client, _) = token_srs_test_client(
        "blocking-token-missing-holder-account",
        "token",
        &[(Pubkey::new_unique(), "1")],
        None,
        None,
    );
    assert!(matches!(
        resolve_with_config(&client, "token.sol", AllowPda::Deny, TEST_NOW),
        Err(SnsError::CouldNotFindSrsOwner)
    ));
}

#[test]
fn applies_pda_policy_to_srs_token_holder() {
    let domain = "token";
    let mint = get_srs_token_mint(&get_sol_domain_key(domain).key);
    let holder_key = Pubkey::new_unique();
    let owner = Pubkey::find_program_address(&[b"token-holder"], &SRS_PROGRAM_ID).0;
    let holder = token_2022_holder_account(mint, owner, 1, AccountState::Initialized);

    let (client, _) = token_srs_test_client(
        "blocking-token-pda-deny",
        domain,
        &[(holder_key, "1")],
        Some(&holder),
        None,
    );
    assert!(matches!(
        resolve_with_config(&client, "token.sol", AllowPda::Deny, TEST_NOW),
        Err(SnsError::PdaOwnerNotAllowed)
    ));

    let (client, _) = token_srs_test_client(
        "blocking-token-pda-any",
        domain,
        &[(holder_key, "1")],
        Some(&holder),
        None,
    );
    assert_eq!(
        resolve_with_config(&client, "token.sol", AllowPda::AllowAny, TEST_NOW).unwrap(),
        owner
    );

    let allowed_program = Pubkey::new_unique();
    let owner_account = Account {
        owner: allowed_program,
        ..Account::default()
    };
    let (client, _) = token_srs_test_client(
        "blocking-token-pda-allowlisted",
        domain,
        &[(holder_key, "1")],
        Some(&holder),
        Some(&owner_account),
    );
    assert_eq!(
        resolve_with_config(
            &client,
            "token.sol",
            AllowPda::Allow(vec![allowed_program]),
            TEST_NOW,
        )
        .unwrap(),
        owner
    );
}

#[test]
fn propagates_srs_token_holder_lookup_errors() {
    let domain = "token";
    let record_key = get_sol_domain_key(domain).key;
    let mint = get_srs_token_mint(&record_key);
    let record = srs_account(SrsRecordOwner::Token(mint));
    let mint_account = token_2022_mint_account(1, 0, true);
    let sender = TestRpcSender::new("blocking-token-largest-error")
        .with_response(RpcRequest::GetAccountInfo, account_response(Some(&record)))
        .with_response(
            RpcRequest::GetAccountInfo,
            account_response(Some(&mint_account)),
        )
        .with_error(RpcRequest::GetTokenLargestAccounts, "RPC unavailable");
    let client =
        RpcClient::new_sender(sender, RpcClientConfig::with_commitment(Default::default()));
    let error = resolve_with_config(&client, "token.sol", AllowPda::Deny, TEST_NOW).unwrap_err();
    assert!(matches!(
        error,
        SnsError::SolanaClient(error)
            if matches!(&*error.kind, solana_client::client_error::ClientErrorKind::Custom(message) if message == "RPC unavailable")
    ));
}

#[test]
fn applies_pda_policy_to_direct_srs_owner() {
    let owner = Pubkey::find_program_address(&[b"owner"], &SRS_PROGRAM_ID).0;
    let record = srs_account(SrsRecordOwner::Pubkey(owner));

    let (client, _) = test_client(
        "blocking-srs-pda-deny",
        [(RpcRequest::GetAccountInfo, account_response(Some(&record)))],
    );
    assert!(matches!(
        resolve_with_config(&client, "pda.sol", AllowPda::Deny, TEST_NOW),
        Err(SnsError::PdaOwnerNotAllowed)
    ));

    let (client, _) = test_client(
        "blocking-srs-pda-any",
        [(RpcRequest::GetAccountInfo, account_response(Some(&record)))],
    );
    assert_eq!(
        resolve_with_config(&client, "pda.sol", AllowPda::AllowAny, TEST_NOW).unwrap(),
        owner
    );

    let allowed_program = Pubkey::new_unique();
    let owner_account = Account {
        owner: allowed_program,
        ..Account::default()
    };
    let (client, _) = test_client(
        "blocking-srs-pda-allowed",
        [
            (RpcRequest::GetAccountInfo, account_response(Some(&record))),
            (
                RpcRequest::GetAccountInfo,
                account_response(Some(&owner_account)),
            ),
        ],
    );
    assert_eq!(
        resolve_with_config(
            &client,
            "pda.sol",
            AllowPda::Allow(vec![allowed_program]),
            TEST_NOW,
        )
        .unwrap(),
        owner
    );

    let (client, _) = test_client(
        "blocking-srs-pda-not-allowed",
        [
            (RpcRequest::GetAccountInfo, account_response(Some(&record))),
            (
                RpcRequest::GetAccountInfo,
                account_response(Some(&owner_account)),
            ),
        ],
    );
    assert!(matches!(
        resolve_with_config(
            &client,
            "pda.sol",
            AllowPda::Allow(vec![Pubkey::new_unique()]),
            TEST_NOW,
        ),
        Err(SnsError::PdaOwnerNotAllowed)
    ));

    let (client, _) = test_client(
        "blocking-srs-pda-missing",
        [
            (RpcRequest::GetAccountInfo, account_response(Some(&record))),
            (RpcRequest::GetAccountInfo, account_response(None)),
        ],
    );
    assert!(matches!(
        resolve_with_config(
            &client,
            "pda.sol",
            AllowPda::Allow(vec![Pubkey::new_unique()]),
            TEST_NOW,
        ),
        Err(SnsError::PdaOwnerNotAllowed)
    ));
}
