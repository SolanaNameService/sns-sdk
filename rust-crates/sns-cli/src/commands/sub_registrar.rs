use crate::commands::CliResult;
use solana_client::nonblocking::rpc_client::RpcClient;

pub(crate) async fn process_sub_registrar_info(rpc_client: &RpcClient, domain: &str) -> CliResult {
    sns_sdk::tld::parse_sns_domain(domain)?;
    let registrar =
        sns_sdk::non_blocking::subdomain::get_sub_registrar_info(rpc_client, domain).await?;
    println!("{registrar:#?}");
    Ok(())
}
