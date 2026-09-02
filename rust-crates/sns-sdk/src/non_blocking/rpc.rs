use solana_client::nonblocking::rpc_client::RpcClient;
use solana_program::pubkey::Pubkey;
use solana_sdk::account::Account;

use crate::error::SnsError;

const MAX_MULTIPLE_ACCOUNTS: usize = 100;

pub(crate) async fn get_multiple_accounts_batched(
    rpc_client: &RpcClient,
    keys: &[Pubkey],
) -> Result<Vec<Option<Account>>, SnsError> {
    let mut accounts = Vec::with_capacity(keys.len());
    for chunk in keys.chunks(MAX_MULTIPLE_ACCOUNTS) {
        accounts.extend(rpc_client.get_multiple_accounts(chunk).await?);
    }
    Ok(accounts)
}
