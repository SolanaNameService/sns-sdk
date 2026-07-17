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

#[cfg(all(test, not(feature = "devnet")))]
mod tests {
    use super::*;
    use dotenv::dotenv;
    use solana_program::pubkey;

    #[test]
    fn test_get_primary_domain() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());

        for (owner, expected) in [
            (
                pubkey!("FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ"),
                pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"),
            ),
            (
                pubkey!("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v"),
                pubkey!("AgJujvNQgYESUwBPitq2VUrfTaT2bvueHbgvsxqZ2sHg"),
            ),
        ] {
            assert_eq!(get_primary_domain(&client, &owner).unwrap(), Some(expected));
        }
    }
}
