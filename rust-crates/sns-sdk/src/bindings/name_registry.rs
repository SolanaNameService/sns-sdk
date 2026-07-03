//! Transaction-instruction builders for SPL name-registry accounts.

use solana_program::{instruction::Instruction, pubkey::Pubkey};
use spl_name_service::{instruction::NameRegistryInstruction, state::get_seeds_and_key};

use crate::{derivation::get_hashed_name, error::SnsError};

/// Build the instruction that creates and funds a name-registry account for `name`.
/// `name` must carry any record/subdomain prefix — the key is derived from it plus `name_class`/`parent`.
#[allow(clippy::too_many_arguments)]
pub fn create_name_registry(
    name: &str,
    space: u32,
    lamports: u64,
    payer: Pubkey,
    owner: Pubkey,
    name_class: Option<Pubkey>,
    parent: Option<Pubkey>,
    parent_owner: Option<Pubkey>,
) -> Result<Instruction, SnsError> {
    let hashed_name = get_hashed_name(name);
    let (name_account, _) = get_seeds_and_key(
        &spl_name_service::ID,
        hashed_name.clone(),
        name_class.as_ref(),
        parent.as_ref(),
    );

    Ok(spl_name_service::instruction::create(
        spl_name_service::ID,
        NameRegistryInstruction::Create {
            hashed_name,
            lamports,
            space,
        },
        name_account,
        payer,
        owner,
        name_class,
        parent,
        parent_owner,
    )?)
}

/// Build the instruction that overwrites a name-registry account's data at `offset`.
pub fn update_name_registry_data(
    name_account: Pubkey,
    offset: u32,
    data: Vec<u8>,
    signer: Pubkey,
    parent: Option<Pubkey>,
) -> Result<Instruction, SnsError> {
    Ok(spl_name_service::instruction::update(
        spl_name_service::ID,
        offset,
        data,
        name_account,
        signer,
        parent,
    )?)
}

/// Build the instruction that transfers a name-registry account to `new_owner`.
pub fn transfer_name_ownership(
    name_account: Pubkey,
    new_owner: Pubkey,
    current_owner: Pubkey,
    name_class: Option<Pubkey>,
) -> Result<Instruction, SnsError> {
    Ok(spl_name_service::instruction::transfer(
        spl_name_service::ID,
        new_owner,
        name_account,
        current_owner,
        name_class,
    )?)
}

/// Build the instruction that deletes a name-registry account and refunds its rent to `refund_target`.
pub fn delete_name_registry(
    name_account: Pubkey,
    owner: Pubkey,
    refund_target: Pubkey,
) -> Result<Instruction, SnsError> {
    Ok(spl_name_service::instruction::delete(
        spl_name_service::ID,
        name_account,
        owner,
        refund_target,
    )?)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{
        derivation::get_domain_key,
        record::{get_record_v1_key, Record},
    };
    use solana_program::pubkey;

    const DOMAIN: &str = "wallet-guide-9.sns";
    const OWNER: Pubkey = pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    const NEW_OWNER: Pubkey = pubkey!("33m47vH6Eav6jr5Ry86XjhRft2jRBLDnDgPSHoquXi2Z");

    fn record_name() -> String {
        format!("\x01{}", Record::Url.as_str())
    }

    #[test]
    fn create_encodes_create_and_derives_record_key() {
        let domain_key = get_domain_key(DOMAIN).unwrap();
        let ix = create_name_registry(
            &record_name(),
            16,
            1_000_000,
            OWNER,
            OWNER,
            None,
            Some(domain_key),
            Some(OWNER),
        )
        .unwrap();

        assert_eq!(ix.program_id, spl_name_service::ID);
        assert_eq!(ix.data[0], 0); // NameRegistryInstruction::Create
                                   // system, payer, name, owner, class-default, parent, parent_owner
        assert_eq!(ix.accounts.len(), 7);
        // the derived account matches the canonical V1 record key for this domain
        assert_eq!(
            ix.accounts[2].pubkey,
            get_record_v1_key(DOMAIN, Record::Url).unwrap()
        );
        assert!(ix.accounts[1].is_signer && ix.accounts[1].is_writable); // payer
        assert!(ix.accounts[6].is_signer); // parent owner
    }

    #[test]
    fn update_encodes_update() {
        let key = get_record_v1_key(DOMAIN, Record::Url).unwrap();
        let ix = update_name_registry_data(key, 0, vec![1, 2, 3], OWNER, None).unwrap();

        assert_eq!(ix.program_id, spl_name_service::ID);
        assert_eq!(ix.data[0], 1); // Update
        assert_eq!(ix.accounts.len(), 2);
        assert_eq!(ix.accounts[0].pubkey, key);
        assert!(ix.accounts[0].is_writable);
        assert!(ix.accounts[1].is_signer); // signer
    }

    #[test]
    fn transfer_encodes_transfer() {
        let key = get_domain_key(DOMAIN).unwrap();
        let ix = transfer_name_ownership(key, NEW_OWNER, OWNER, None).unwrap();

        assert_eq!(ix.data[0], 2); // Transfer
        assert_eq!(&ix.data[1..33], NEW_OWNER.as_ref()); // new owner rides in the data
        assert_eq!(ix.accounts.len(), 2);
        assert!(ix.accounts[1].is_signer); // current owner
    }

    #[test]
    fn delete_encodes_delete() {
        let key = get_domain_key(DOMAIN).unwrap();
        let ix = delete_name_registry(key, OWNER, OWNER).unwrap();

        assert_eq!(ix.data[0], 3); // Delete
        assert_eq!(ix.accounts.len(), 3);
        assert!(ix.accounts[1].is_signer); // owner
        assert!(ix.accounts[2].is_writable); // refund target
    }
}

/// Simulates the builders against mainnet, `sig_verify: false` so no keypair is needed. The
/// create/update/delete trio runs in one transaction on a fresh V1 record under the test
/// domain (so the record-exists precondition holds without committing). Needs `RPC_URL`.
#[cfg(test)]
mod simulate {
    use super::*;
    use crate::{
        derivation::get_domain_key,
        record::{get_record_v1_key, Record},
    };
    use dotenv::dotenv;
    use solana_client::{
        nonblocking::rpc_client::RpcClient, rpc_config::RpcSimulateTransactionConfig,
    };
    use solana_program::{program_pack::Pack, pubkey};
    use solana_sdk::transaction::Transaction;
    use spl_name_service::state::NameRecordHeader;

    const DOMAIN: &str = "wallet-guide-9.sns";
    const OWNER: Pubkey = pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    const NEW_OWNER: Pubkey = pubkey!("33m47vH6Eav6jr5Ry86XjhRft2jRBLDnDgPSHoquXi2Z");

    fn client() -> RpcClient {
        dotenv().ok();
        RpcClient::new(std::env::var("RPC_URL").unwrap())
    }

    async fn simulate_ok(rpc: &RpcClient, ixs: &[Instruction]) {
        let tx = Transaction::new_with_payer(ixs, Some(&OWNER));
        let config = RpcSimulateTransactionConfig {
            sig_verify: false,
            replace_recent_blockhash: true,
            ..Default::default()
        };
        let res = rpc
            .simulate_transaction_with_config(&tx, config)
            .await
            .unwrap();
        assert!(
            res.value.err.is_none(),
            "simulation failed: {:?}",
            res.value
        );
    }

    #[tokio::test]
    async fn create_update_delete_record() {
        let rpc = client();
        let domain_key = get_domain_key(DOMAIN).unwrap();
        let record_key = get_record_v1_key(DOMAIN, Record::Url).unwrap();
        let data = b"https://sns.id".to_vec();
        let lamports = rpc
            .get_minimum_balance_for_rent_exemption(data.len() + NameRecordHeader::LEN)
            .await
            .unwrap();

        let create = create_name_registry(
            &format!("\x01{}", Record::Url.as_str()),
            data.len() as u32,
            lamports,
            OWNER,
            OWNER,
            None,
            Some(domain_key),
            Some(OWNER),
        )
        .unwrap();
        let update = update_name_registry_data(record_key, 0, data, OWNER, None).unwrap();
        let delete = delete_name_registry(record_key, OWNER, OWNER).unwrap();

        simulate_ok(&rpc, &[create, update, delete]).await;
    }

    #[tokio::test]
    async fn transfer_domain() {
        let rpc = client();
        let domain_key = get_domain_key(DOMAIN).unwrap();
        let ix = transfer_name_ownership(domain_key, NEW_OWNER, OWNER, None).unwrap();
        simulate_ok(&rpc, &[ix]).await;
    }
}
