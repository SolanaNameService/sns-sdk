use solana_client::rpc_client::RpcClient;
use solana_program::pubkey::Pubkey;

use crate::{
    error::SnsError,
    primary_domain::{derive_primary_domain_key, PrimaryDomain},
};

pub fn get_primary_domain(
    rpc_client: &RpcClient,
    owner: &Pubkey,
) -> Result<Option<Pubkey>, SnsError> {
    let primary_domain_state_key = derive_primary_domain_key(owner);
    let account = rpc_client
        .get_account_with_commitment(&primary_domain_state_key, rpc_client.commitment())?
        .value;
    if let Some(a) = account {
        let parsed = PrimaryDomain::parse(&a.data)?;
        Ok(Some(parsed.name_account))
    } else {
        Ok(None)
    }
}
