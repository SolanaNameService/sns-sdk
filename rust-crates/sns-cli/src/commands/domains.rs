use crate::{
    commands::CliResult,
    domain::parse_sns_domain_key,
    output::{display_reverse_domain, progress_bar},
};
use console::Term;
use prettytable::{row, Table};
use sns_sdk::{
    error::SnsError,
    non_blocking::{domain, resolve},
};
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_program::pubkey::Pubkey;
use std::str::FromStr;

pub(crate) async fn process_domains(rpc_client: &RpcClient, owners: Vec<String>) -> CliResult {
    println!("Resolving domains...\n");
    let mut table = Table::new();
    table.add_row(row!["Domain", "Owner", "Link"]);
    let pb = progress_bar(owners.len());
    for (idx, owner) in owners.into_iter().enumerate() {
        let owner_key = Pubkey::from_str(&owner)?;
        let domains = domain::get_sns_domains_for_owner(rpc_client, owner_key).await?;
        resolve::resolve_reverse_batch(rpc_client, &domains)
            .await?
            .into_iter()
            .flatten()
            .for_each(|x| {
                let displayed = display_reverse_domain(&x);
                table.add_row(row![
                    displayed,
                    owner,
                    format!("https://naming.bonfida.org/domain/{x}")
                ]);
            });
        pb.set_position(idx as u64);
    }
    pb.finish();
    Term::stdout().clear_to_end_of_screen()?;
    table.printstd();
    Ok(())
}

pub(crate) async fn process_resolve(rpc_client: &RpcClient, domains: Vec<String>) -> CliResult {
    println!("Resolving domains...\n");
    let mut table = Table::new();
    table.add_row(row!["Domain", "Owner", "Explorer"]);
    let pb = progress_bar(domains.len());
    for (idx, domain) in domains.into_iter().enumerate() {
        sns_sdk::tld::parse_sns_domain(&domain)?;
        let row = match resolve::resolve(rpc_client, &domain, resolve::AllowPda::Deny).await {
            Ok(owner) => row![
                domain,
                owner,
                format!("https://explorer.solana.com/address/{owner}")
            ],
            Err(SnsError::DomainDoesNotExist) => row![domain, "Domain not found"],
            Err(error) => return Err(error.into()),
        };
        table.add_row(row);
        pb.set_position(idx as u64);
    }
    pb.finish();
    Term::stdout().clear_to_end_of_screen()?;
    table.printstd();
    Ok(())
}

fn display_registry_data(data: &[u8]) -> String {
    let data = data
        .iter()
        .rposition(|byte| *byte != 0)
        .map(|last_non_zero| &data[..=last_non_zero])
        .unwrap_or_default();
    String::from_utf8_lossy(data).to_string()
}

pub(crate) async fn process_lookup(rpc_client: &RpcClient, domains: Vec<String>) -> CliResult {
    println!("Fetching information...\n");
    let mut table = Table::new();
    table.add_row(row!["Domain", "Domain key", "Parent", "Owner", "Data"]);
    let pb = progress_bar(domains.len());
    for (idx, domain) in domains.into_iter().enumerate() {
        let domain_key_with_parent = parse_sns_domain_key(&domain)?;
        let row =
            match resolve::resolve_name_registry(rpc_client, &domain_key_with_parent.key).await? {
                Some((header, data)) => row![
                    domain,
                    domain_key_with_parent.key,
                    header.parent_name,
                    header.owner,
                    display_registry_data(&data)
                ],
                None => row![
                    domain,
                    domain_key_with_parent.key,
                    domain_key_with_parent.parent,
                    "N/A",
                    "N/A"
                ],
            };
        table.add_row(row);
        pb.set_position(idx as u64);
    }
    pb.finish();
    Term::stdout().clear_to_end_of_screen()?;
    table.printstd();
    Ok(())
}

pub(crate) async fn process_reverse_lookup(rpc_client: &RpcClient, key: &str) -> CliResult {
    println!("Fetching information about {key}\n");
    if let Some(reverse) = resolve::resolve_reverse(rpc_client, &Pubkey::from_str(key)?).await? {
        let mut table = Table::new();
        table.add_row(row!["Public key", "Reverse"]);
        table.add_row(row![key, display_reverse_domain(&reverse)]);
        Term::stdout().clear_line()?;
        table.printstd();
    } else {
        Term::stdout().clear_line()?;
        println!("Domain not found - Are you sure it exists?")
    }
    Ok(())
}
