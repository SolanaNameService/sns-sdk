use crate::{
    commands::CliResult,
    domain::parse_sns_domain_key,
    output::{make_tx_url, progress_bar},
};
use console::Term;
use prettytable::{row, Table};
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::{
    signer::{keypair::read_keypair_file, Signer},
    transaction::Transaction,
};

pub(crate) async fn process_burn(
    rpc_client: &RpcClient,
    keypair_path: &str,
    domains: Vec<String>,
) -> CliResult {
    println!("Burning domain...");
    let mut table = Table::new();
    table.add_row(row!["Domain", "Transaction", "Explorer"]);
    let pb = progress_bar(domains.len());
    for (idx, domain) in domains.into_iter().enumerate() {
        let domain_key = parse_sns_domain_key(&domain)?.key;
        let keypair = read_keypair_file(keypair_path)?;
        let ix = spl_name_service::instruction::delete(
            spl_name_service::ID,
            domain_key,
            keypair.pubkey(),
            keypair.pubkey(),
        )?;
        let mut tx = Transaction::new_with_payer(&[ix], Some(&keypair.pubkey()));
        tx.partial_sign(&[&keypair], rpc_client.get_latest_blockhash().await?);
        let sig = rpc_client.send_and_confirm_transaction(&tx).await?;
        table.add_row(row![domain, sig, make_tx_url(&sig.to_string())]);
        pb.set_position(idx as u64);
    }
    pb.finish();
    Term::stdout().clear_to_end_of_screen()?;
    table.printstd();
    Ok(())
}
