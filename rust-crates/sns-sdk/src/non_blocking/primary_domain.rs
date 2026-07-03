use solana_client::nonblocking::rpc_client::RpcClient;
use solana_program::pubkey::Pubkey;

use crate::{
    error::SnsError,
    primary_domain::{derive_primary_domain_key, PrimaryDomain},
};

pub async fn get_primary_domain(
    rpc_client: &RpcClient,
    owner: &Pubkey,
) -> Result<Option<Pubkey>, SnsError> {
    let primary_domain_state_key = derive_primary_domain_key(owner);
    let account = rpc_client
        .get_account_with_commitment(&primary_domain_state_key, rpc_client.commitment())
        .await?
        .value;
    if let Some(a) = account {
        let parsed = PrimaryDomain::parse(&a.data)?;
        Ok(Some(parsed.name_account))
    } else {
        Ok(None)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use dotenv::dotenv;
    use solana_program::pubkey;

    #[tokio::test]
    async fn test_get_primary_domain() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let domain = get_primary_domain(
            &client,
            &pubkey!("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA"),
        )
        .await
        .unwrap();
        assert_eq!(
            &domain.unwrap().to_string(),
            "Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"
        );
    }
}
