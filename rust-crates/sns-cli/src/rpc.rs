use solana_client::nonblocking::rpc_client::RpcClient;

const DEFAULT_RPC_URL: &str = "https://api.mainnet-beta.solana.com";

pub(crate) fn select_rpc_url(cli_url: Option<String>, env_url: Option<String>) -> String {
    cli_url
        .or_else(|| env_url.filter(|url| !url.trim().is_empty()))
        .unwrap_or_else(|| DEFAULT_RPC_URL.to_string())
}

pub(crate) fn get_rpc_client(url: Option<String>) -> RpcClient {
    let env_url = std::env::var("RPC_URL").ok();
    RpcClient::new(select_rpc_url(url, env_url))
}
