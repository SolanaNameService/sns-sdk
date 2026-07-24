use super::*;
use crate::{
    derivation::{get_srs_domain_key, SRS_PROGRAM_ID},
    resolve::{get_srs_token_mint, srs_record_data, token_2022_mint_account, SrsRecordOwner},
    utils::test::{account_response, token_largest_accounts_response, TestRpcSender},
};
use borsh::BorshSerialize;
use serde_json::{json, Value};
use solana_client::{rpc_client::RpcClientConfig, rpc_request::RpcRequest};
use solana_sdk::account::Account;

const TEST_NOW: i64 = 1_000;

fn test_client(
    endpoint: &str,
    responses: impl IntoIterator<Item = (RpcRequest, Value)>,
) -> (RpcClient, TestRpcSender) {
    let sender = responses.into_iter().fold(
        TestRpcSender::new(endpoint, json!(0)),
        |sender, (request, response)| sender.with_response(request, response),
    );
    let client = RpcClient::new_sender(
        sender.clone(),
        RpcClientConfig::with_commitment(Default::default()),
    );
    (client, sender)
}

fn srs_account(owner: SrsRecordOwner) -> Account {
    Account {
        lamports: 1,
        data: srs_record_data(owner, TEST_NOW + 1),
        owner: SRS_PROGRAM_ID,
        executable: false,
        rent_epoch: 0,
    }
}

fn registry_account(owner: Pubkey) -> Account {
    let header = NameRecordHeader {
        parent_name: Pubkey::default(),
        owner,
        class: Pubkey::default(),
    };
    let mut data = vec![0; NameRecordHeader::LEN];
    NameRecordHeader::pack(header, &mut data).unwrap();
    Account {
        data,
        owner: spl_name_service::ID,
        ..Account::default()
    }
}

fn active_nft_record_account(domain_key: Pubkey, mint_key: Pubkey) -> Account {
    let record = NftRecord::new(0, Pubkey::new_unique(), domain_key, mint_key);
    let mut data = Vec::new();
    record.serialize(&mut data).unwrap();
    Account {
        data,
        owner: NAME_TOKENIZER_ID,
        ..Account::default()
    }
}

fn token_srs_test_client(
    endpoint: &str,
    domain: &str,
    balances: &[(Pubkey, &str)],
    holder_account: Option<&Account>,
    owner_account: Option<&Account>,
) -> (RpcClient, TestRpcSender) {
    let record_key = get_srs_domain_key(domain).key;
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

mod name_registry;
mod reverse;
mod routing;
#[cfg(not(feature = "devnet"))]
mod rpc;
mod sns;
mod srs;
