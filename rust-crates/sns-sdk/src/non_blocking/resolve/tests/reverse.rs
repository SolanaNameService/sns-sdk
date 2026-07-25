use super::*;
use crate::{derivation::derive_reverse, utils::test::account_response};
use serde_json::json;

fn reverse_account(payload: &[u8]) -> Account {
    let mut account = registry_account(Pubkey::new_unique());
    account.data.extend_from_slice(payload);
    account
}

fn encoded_reverse(name: &[u8]) -> Vec<u8> {
    let mut data = (name.len() as u32).to_le_bytes().to_vec();
    data.extend_from_slice(name);
    data
}

#[tokio::test]
async fn resolve_reverse_with_parent_preserves_legacy_top_level_behavior() {
    let key = Pubkey::new_unique();
    let account = reverse_account(&encoded_reverse(b"example"));
    let response = account_response(Some(&account));
    let (legacy_client, legacy_sender) = test_client(
        "nb-reverse-legacy",
        [(RpcRequest::GetAccountInfo, response.clone())],
    );
    let (parent_client, parent_sender) = test_client(
        "nb-reverse-parent-none",
        [(RpcRequest::GetAccountInfo, response)],
    );

    let legacy = resolve_reverse(&legacy_client, &key).await.unwrap();
    let parent_aware = resolve_reverse_with_parent(&parent_client, &key, None)
        .await
        .unwrap();

    assert_eq!(legacy, Some("example".to_owned()));
    assert_eq!(legacy, parent_aware);
    let expected = json!(derive_reverse(&key, None).to_string());
    assert_eq!(legacy_sender.requests()[0].1[0], expected);
    assert_eq!(parent_sender.requests()[0].1[0], expected);
}

#[tokio::test]
async fn resolve_reverse_with_parent_targets_child_and_strips_one_marker() {
    let key = Pubkey::new_unique();
    let parent = Pubkey::new_unique();
    let account = reverse_account(&encoded_reverse(b"\0team"));
    let (client, sender) = test_client(
        "nb-reverse-child-marker",
        [(RpcRequest::GetAccountInfo, account_response(Some(&account)))],
    );

    assert_eq!(
        resolve_reverse_with_parent(&client, &key, Some(&parent))
            .await
            .unwrap(),
        Some("team".to_owned())
    );
    let requested = &sender.requests()[0].1[0];
    assert_eq!(
        requested,
        &json!(derive_reverse(&key, Some(&parent)).to_string())
    );
    assert_ne!(requested, &json!(derive_reverse(&key, None).to_string()));
}

#[tokio::test]
async fn resolve_reverse_with_parent_accepts_unmarked_child_payload() {
    let key = Pubkey::new_unique();
    let parent = Pubkey::new_unique();
    let account = reverse_account(&encoded_reverse(b"team"));
    let (client, _) = test_client(
        "nb-reverse-child-unmarked",
        [(RpcRequest::GetAccountInfo, account_response(Some(&account)))],
    );

    assert_eq!(
        resolve_reverse_with_parent(&client, &key, Some(&parent))
            .await
            .unwrap(),
        Some("team".to_owned())
    );
}

#[tokio::test]
async fn resolve_reverse_with_parent_returns_none_for_absent_account() {
    let (client, _) = test_client("nb-reverse-absent", []);

    assert_eq!(
        resolve_reverse_with_parent(&client, &Pubkey::new_unique(), None)
            .await
            .unwrap(),
        None
    );
}

#[tokio::test]
async fn resolve_reverse_with_parent_rejects_malformed_payloads() {
    let payloads = [
        vec![1, 0, 0],
        [5u32.to_le_bytes().as_slice(), b"a"].concat(),
        [1u32.to_le_bytes().as_slice(), &[0xff]].concat(),
    ];

    for (index, payload) in payloads.iter().enumerate() {
        let account = reverse_account(payload);
        let (client, _) = test_client(
            &format!("nb-reverse-malformed-{index}"),
            [(RpcRequest::GetAccountInfo, account_response(Some(&account)))],
        );
        assert!(matches!(
            resolve_reverse_with_parent(&client, &Pubkey::new_unique(), None).await,
            Err(SnsError::InvalidReverse)
        ));
    }
}
