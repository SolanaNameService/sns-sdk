use super::*;
use crate::{resolve::token_2022_holder_account, utils::test::account_response};
use serde_json::json;
use solana_program::pubkey;
use spl_token_2022::state::AccountState;

#[test]
fn rejects_missing_srs_record() {
    let (client, sender) = test_client("blocking-srs-missing", []);
    assert!(matches!(
        resolve_with_config(&client, "missing.sol", AllowPda::Deny, true, TEST_NOW),
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
        resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW),
        Err(SnsError::RecordMalformed)
    ));
    assert_eq!(sender.requests().len(), 1);
}

#[test]
fn resolves_initialized_and_frozen_srs_token_holders() {
    let domain = "token";
    let record_key = get_srs_domain_key(domain).key;
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
            resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW,).unwrap(),
            owner
        );
    }
}

#[test]
fn rejects_missing_srs_token_mint() {
    let domain = "token";
    let record_key = get_srs_domain_key(domain).key;
    let mint = get_srs_token_mint(&record_key);
    let record = srs_account(SrsRecordOwner::Token(mint));
    let (client, _) = test_client(
        "blocking-token-missing-mint",
        [(RpcRequest::GetAccountInfo, account_response(Some(&record)))],
    );
    assert!(matches!(
        resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW),
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
            resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW),
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
        resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW),
        Err(SnsError::CouldNotFindSrsOwner)
    ));
}

#[test]
fn applies_pda_policy_to_srs_token_holder() {
    let domain = "token";
    let mint = get_srs_token_mint(&get_srs_domain_key(domain).key);
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
        resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW),
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
        resolve_with_config(&client, "token.sol", AllowPda::AllowAny, true, TEST_NOW).unwrap(),
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
            true,
            TEST_NOW,
        )
        .unwrap(),
        owner
    );
}

#[test]
fn propagates_srs_token_holder_lookup_errors() {
    let domain = "token";
    let record_key = get_srs_domain_key(domain).key;
    let mint = get_srs_token_mint(&record_key);
    let record = srs_account(SrsRecordOwner::Token(mint));
    let mint_account = token_2022_mint_account(1, 0, true);
    let sender = TestRpcSender::new("blocking-token-largest-error", json!(0))
        .with_response(RpcRequest::GetAccountInfo, account_response(Some(&record)))
        .with_response(
            RpcRequest::GetAccountInfo,
            account_response(Some(&mint_account)),
        )
        .with_error(RpcRequest::GetTokenLargestAccounts, "RPC unavailable");
    let client =
        RpcClient::new_sender(sender, RpcClientConfig::with_commitment(Default::default()));
    let error =
        resolve_with_config(&client, "token.sol", AllowPda::Deny, true, TEST_NOW).unwrap_err();
    assert!(matches!(
        error,
        SnsError::SolanaClient(error)
            if matches!(&error.kind, solana_client::client_error::ClientErrorKind::Custom(message) if message == "RPC unavailable")
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
        resolve_with_config(&client, "pda.sol", AllowPda::Deny, true, TEST_NOW),
        Err(SnsError::PdaOwnerNotAllowed)
    ));

    let (client, _) = test_client(
        "blocking-srs-pda-any",
        [(RpcRequest::GetAccountInfo, account_response(Some(&record)))],
    );
    assert_eq!(
        resolve_with_config(&client, "pda.sol", AllowPda::AllowAny, true, TEST_NOW).unwrap(),
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
            true,
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
            true,
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
            true,
            TEST_NOW,
        ),
        Err(SnsError::PdaOwnerNotAllowed)
    ));
}
