mod cli;
mod commands;
mod domain;
mod output;
mod rpc;

use clap::Parser;
use cli::{
    Cli, Commands, CountCommand, PrimaryDomainCommand, PrimaryDomainSubCommand, RecordV2Command,
    RecordV2SubCommand, SubRegistrarCommand, SubRegistrarSubCommand,
};
use commands::{
    burn::process_burn,
    count::process_count_command,
    domains::{process_domains, process_lookup, process_resolve, process_reverse_lookup},
    primary_domain::{process_get_primary_domain, process_set_primary_domain},
    record_v2::{process_record_v2_get, process_record_v2_set},
    registration::process_register,
    sub_registrar::process_sub_registrar_info,
    transfer::process_transfer,
};
use rpc::get_rpc_client;
use std::process::ExitCode;

async fn run() -> commands::CliResult {
    let Cli { url, command } = Cli::parse();
    let rpc_client = get_rpc_client(url);
    match command {
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
        Commands::PrimaryDomain(PrimaryDomainCommand { cmd }) => match cmd {
            PrimaryDomainSubCommand::Get { owner } => {
                process_get_primary_domain(&rpc_client, &owner).await
            }
            PrimaryDomainSubCommand::Set {
                owner_keypair,
                domain,
            } => process_set_primary_domain(&rpc_client, &owner_keypair, &domain).await,
        },
        Commands::RecordV2(RecordV2Command { cmd }) => match cmd {
            RecordV2SubCommand::Get { domain, record } => {
                process_record_v2_get(&rpc_client, &domain, record).await
            }
            RecordV2SubCommand::Set {
                keypair,
                domain,
                record,
                content,
                force,
            } => {
                process_record_v2_set(&rpc_client, &keypair, &domain, record, &content, force).await
            }
        },
        Commands::SubRegistrar(SubRegistrarCommand { cmd }) => match cmd {
            SubRegistrarSubCommand::Get { domain } => {
                process_sub_registrar_info(&rpc_client, &domain).await
            }
        },
        Commands::Count(CountCommand { cmd }) => process_count_command(&rpc_client, cmd).await,
    }
}

#[tokio::main]
async fn main() -> ExitCode {
    match run().await {
        Ok(()) => ExitCode::SUCCESS,
        Err(err) => {
            eprintln!("Error: {err:?}");
            ExitCode::FAILURE
        }
    }
}
