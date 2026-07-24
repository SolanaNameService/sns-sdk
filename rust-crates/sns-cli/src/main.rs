mod cli;
mod commands;
mod domain;
mod output;
mod rpc;

use clap::Parser;
use cli::{Cli, Commands, CountCommand, RecordV2Command, RecordV2SubCommand};
use commands::{
    count::process_count_command,
    domains::{process_domains, process_lookup, process_resolve, process_reverse_lookup},
    ownership::{process_burn, process_set_primary_domain, process_transfer},
    record_v2::process_record_v2_get,
    registration::process_register,
    sub_registrar::process_sub_registrar_info,
};
use rpc::get_rpc_client;

#[tokio::main]
async fn main() {
    let Cli { url, command } = Cli::parse();
    let rpc_client = get_rpc_client(url);
    let res = match command {
        Commands::Resolve { domain } => process_resolve(&rpc_client, domain).await,
        Commands::Domains { owners } => process_domains(&rpc_client, owners).await,
        Commands::Burn {
            domain,
            keypair_path,
        } => process_burn(&rpc_client, &keypair_path, domain).await,
        Commands::Transfer {
            domain,
            owner_keypair,
            new_owner,
        } => process_transfer(&rpc_client, domain, &owner_keypair, &new_owner).await,
        Commands::Lookup { domain } => process_lookup(&rpc_client, domain).await,
        Commands::ReverseLookup { key } => process_reverse_lookup(&rpc_client, &key).await,
        Commands::Register {
            domains,
            keypair_path,
            space,
        } => process_register(&rpc_client, &keypair_path, domains, space).await,
        Commands::SetPrimaryDomain {
            owner_keypair,
            domain,
        } => process_set_primary_domain(&rpc_client, &owner_keypair, &domain).await,
        Commands::RecordV2(RecordV2Command { cmd }) => match cmd {
            RecordV2SubCommand::Get { domain, record } => {
                process_record_v2_get(&rpc_client, &domain, &record).await
            }
        },
        Commands::GetSubRegistrarInfo { domain } => {
            process_sub_registrar_info(&rpc_client, &domain).await
        }
        Commands::Count(CountCommand { cmd }) => process_count_command(&rpc_client, cmd).await,
    };

    if let Err(err) = res {
        eprintln!("Error: {err:?}")
    }
}
