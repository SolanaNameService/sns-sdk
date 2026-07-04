use solana_account_decoder::UiAccountEncoding;
use solana_client::{
    rpc_client::RpcClient,
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, RpcFilterType},
};
use solana_program::{program_pack::Pack, pubkey::Pubkey};
use spl_name_service::state::NameRecordHeader;

use crate::{derivation::REVERSE_LOOKUP_CLASS, error::SnsError};

#[cfg(feature = "subdomain")]
use crate::derivation::get_domain_key;
#[cfg(feature = "subdomain")]
use borsh::BorshDeserialize;

#[cfg(feature = "subdomain")]
pub use sub_registrar::state::registry::Registrar;
#[cfg(feature = "subdomain")]
pub use sub_registrar::state::Tag as SubRegistrarAccountTag;
#[cfg(feature = "subdomain")]
pub use sub_registrar::ID as SUB_REGISTRAR_PROGRAM_ID;

pub fn get_subdomains(rpc_client: &RpcClient, parent: &Pubkey) -> Result<Vec<String>, SnsError> {
    let config = RpcProgramAccountsConfig {
        filters: Some(vec![
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(0, parent.to_bytes().to_vec())),
            RpcFilterType::Memcmp(Memcmp::new_raw_bytes(
                64,
                REVERSE_LOOKUP_CLASS.to_bytes().to_vec(),
            )),
        ]),
        with_context: None,
        account_config: RpcAccountInfoConfig {
            encoding: Some(UiAccountEncoding::Base64),
            ..Default::default()
        },
        sort_results: None,
    };
    let res = rpc_client.get_program_accounts_with_config(&spl_name_service::ID, config)?;

    let mut results = Vec::with_capacity(res.len());
    for (_, acc) in res {
        let payload = acc
            .data
            .get(NameRecordHeader::LEN..)
            .ok_or(SnsError::InvalidNameAccountData)?;
        let len_data = payload.get(..4).ok_or(SnsError::InvalidReverse)?;
        let len = u32::from_le_bytes(len_data.try_into().map_err(|_| SnsError::InvalidReverse)?);
        let label_data = payload
            .get(4..4 + len as usize)
            .ok_or(SnsError::InvalidReverse)?;
        let label = String::from_utf8(label_data.to_vec()).map_err(|_| SnsError::InvalidReverse)?;
        let subdomain = label
            .strip_prefix('\0')
            .ok_or(SnsError::InvalidReverse)?
            .to_owned();
        results.push(subdomain);
    }
    Ok(results)
}

#[cfg(feature = "subdomain")]
pub fn get_sub_registrar_info(rpc_client: &RpcClient, domain: &str) -> Result<Registrar, SnsError> {
    let key = get_domain_key(domain)?;
    let registrar_key = Registrar::find_key(&key, &SUB_REGISTRAR_PROGRAM_ID).0;
    let account = rpc_client.get_account_data(&registrar_key)?;
    let expected_tag = SubRegistrarAccountTag::Registrar;
    if account[0] != expected_tag as u8 {
        return Err(SnsError::InvalidSubRegistrar);
    }
    let result = Registrar::deserialize(&mut (&account as &[u8]))?;
    Ok(result)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::derivation::get_domain_key;
    use dotenv::dotenv;

    #[test]
    fn test_get_subdomains() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let parent = get_domain_key("bonfida.sol").unwrap();
        let mut reverse = get_subdomains(&client, &parent).unwrap();
        reverse.sort();
        assert_eq!(reverse, vec!["dex", "naming", "test"]);
    }
}
