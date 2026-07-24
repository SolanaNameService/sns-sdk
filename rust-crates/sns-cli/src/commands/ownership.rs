use crate::{
    commands::CliResult,
    domain::parse_sns_domain_key,
    output::{make_tx_url, progress_bar},
};
use console::Term;
use prettytable::{row, Table};
use sns_sdk::{primary_domain::set_primary_domain::Accounts, NAME_OFFERS_PROGRAM_ID};
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_program::pubkey::Pubkey;
use solana_sdk::{
    signer::{keypair::read_keypair_file, Signer},
    transaction::Transaction,
};
use solana_sdk_ids::system_program;
use std::str::FromStr;

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

pub(crate) async fn process_transfer(
    rpc_client: &RpcClient,
    domains: Vec<String>,
    owner_keypair: &str,
    new_owner: &str,
) -> CliResult {
    println!("Transfering domains...");
    let mut table = Table::new();
    table.add_row(row!["Domain", "Transaction", "Explorer"]);
    let pb = progress_bar(domains.len());
    for (idx, domain) in domains.into_iter().enumerate() {
        let domain_key = parse_sns_domain_key(&domain)?.key;
        let keypair = read_keypair_file(owner_keypair)?;
        let ix = spl_name_service::instruction::transfer(
            spl_name_service::ID,
            Pubkey::from_str(new_owner)?,
            domain_key,
            keypair.pubkey(),
            None,
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

pub(crate) async fn process_set_primary_domain(
    rpc_client: &RpcClient,
    owner_keypair_path: &str,
    domain: &str,
) -> CliResult {
    println!("Setting primary domain...");
    let owner_keypair = read_keypair_file(owner_keypair_path)?;
    let owner = owner_keypair.pubkey();
    let domain_key = parse_sns_domain_key(domain)?.key;
    let ix = sns_sdk::primary_domain::set_primary_domain_instruction(
        NAME_OFFERS_PROGRAM_ID,
        Accounts {
            owner: &owner,
            name: &domain_key,
            primary_domain: &sns_sdk::primary_domain::derive_primary_domain_key(&owner),
            system_program: &system_program::ID,
        },
        sns_sdk::primary_domain::set_primary_domain::Params {},
    );
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&owner),
        &[&owner_keypair],
        rpc_client.get_latest_blockhash().await?,
    );
    let sig = rpc_client.send_and_confirm_transaction(&tx).await?;
    println!("Primary domain set, txid: {sig}");
    Ok(())
}
