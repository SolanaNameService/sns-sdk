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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn select_rpc_url_prefers_cli_then_nonempty_environment_then_default() {
        assert_eq!(
            select_rpc_url(
                Some("https://cli.example".into()),
                Some("https://env.example".into())
            ),
            "https://cli.example"
        );
        assert_eq!(
            select_rpc_url(None, Some("https://env.example".into())),
            "https://env.example"
        );
        assert_eq!(select_rpc_url(None, Some("  ".into())), DEFAULT_RPC_URL);
        assert_eq!(select_rpc_url(None, None), DEFAULT_RPC_URL);
    }
}
