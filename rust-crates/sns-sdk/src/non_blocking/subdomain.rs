use crate::derivation::get_domain_key;
use crate::error::SnsError;
use borsh::BorshDeserialize;
use solana_client::nonblocking::rpc_client::RpcClient;

pub use sub_registrar::state::registry::Registrar;
pub use sub_registrar::state::Tag as SubRegistrarAccountTag;
pub use sub_registrar::ID as SUB_REGISTRAR_PROGRAM_ID;

pub async fn get_sub_registrar_info(
    rpc_client: &RpcClient,
    domain: &str,
) -> Result<Registrar, SnsError> {
    let key = get_domain_key(domain)?;
    let registrar_key = Registrar::find_key(&key, &SUB_REGISTRAR_PROGRAM_ID).0;
    let account = rpc_client.get_account_data(&registrar_key).await?;
    let expected_tag = SubRegistrarAccountTag::Registrar;
    if account[0] != expected_tag as u8 {
        return Err(SnsError::InvalidSubRegistrar);
    }
    let result = Registrar::deserialize(&mut (&account as &[u8]))?;
    Ok(result)
}
