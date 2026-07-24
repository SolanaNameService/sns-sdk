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
    let args = Cli::parse();
    let res = match args.command {
        Commands::Resolve { domain, url } => process_resolve(&get_rpc_client(url), domain).await,
        Commands::Domains { owners, url } => process_domains(&get_rpc_client(url), owners).await,
        Commands::Burn {
            domain,
            keypair_path,
            url,
        } => process_burn(&get_rpc_client(url), &keypair_path, domain).await,
        Commands::Transfer {
            domain,
            owner_keypair,
            new_owner,
            url,
        } => process_transfer(&get_rpc_client(url), domain, &owner_keypair, &new_owner).await,
        Commands::Lookup { domain, url } => process_lookup(&get_rpc_client(url), domain).await,
        Commands::ReverseLookup { key, url } => {
            process_reverse_lookup(&get_rpc_client(url), &key).await
        }
        Commands::Register {
            domains,
            keypair_path,
            space,
            url,
        } => process_register(&get_rpc_client(url), &keypair_path, domains, space).await,
        Commands::SetPrimaryDomain {
            owner_keypair,
            domain,
            url,
        } => process_set_primary_domain(&get_rpc_client(url), &owner_keypair, &domain).await,
        Commands::RecordV2(RecordV2Command { cmd, url }) => match cmd {
            RecordV2SubCommand::Get { domain, record } => {
                process_record_v2_get(&get_rpc_client(url), &domain, &record).await
            }
        },
        Commands::GetSubRegistrarInfo { url, domain } => {
            process_sub_registrar_info(&get_rpc_client(url), &domain).await
        }
        Commands::Count(CountCommand { cmd, url }) => {
            process_count_command(&get_rpc_client(url), cmd).await
        }
    };

    if let Err(err) = res {
        eprintln!("Error: {err:?}")
    }
}
