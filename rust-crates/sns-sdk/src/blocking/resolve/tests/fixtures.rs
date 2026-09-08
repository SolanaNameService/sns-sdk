use super::*;
use crate::{
    derivation::SRS_PROGRAM_ID,
    resolve::{srs_record_data, SrsRecordOwner},
    utils::test::TestRpcSender,
};
use serde_json::Value;
use solana_client::{rpc_client::RpcClientConfig, rpc_request::RpcRequest};
use solana_program::{program_pack::Pack, pubkey::Pubkey};
use solana_sdk::account::Account;
use spl_name_service::state::NameRecordHeader;

pub(super) const TEST_NOW: i64 = 1_000;

pub(super) fn test_client(
    endpoint: &str,
    responses: impl IntoIterator<Item = (RpcRequest, Value)>,
) -> (RpcClient, TestRpcSender) {
    let sender = responses.into_iter().fold(
        TestRpcSender::new(endpoint),
        |sender, (request, response)| sender.with_response(request, response),
    );
    let client = RpcClient::new_sender(
        sender.clone(),
        RpcClientConfig::with_commitment(Default::default()),
    );
    (client, sender)
}

pub(super) fn srs_account(owner: SrsRecordOwner) -> Account {
    Account {
        lamports: 1,
        data: srs_record_data(owner, TEST_NOW + 1),
        owner: SRS_PROGRAM_ID,
        executable: false,
        rent_epoch: 0,
    }
}

pub(super) fn registry_account(owner: Pubkey) -> Account {
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
