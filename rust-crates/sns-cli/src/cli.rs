use clap::{Args, Parser, Subcommand};

#[derive(Debug, Parser)]
#[command(name = "sns")]
#[command(about = "Solana Name Service CLI", long_about = None)]
pub(crate) struct Cli {
    #[command(subcommand)]
    pub(crate) command: Commands,
}

pub(crate) const MIN_REGISTRATION_SPACE: u32 = 1_000;
pub(crate) const MAX_REGISTRATION_SPACE: u32 = 10_000;

pub(crate) fn parse_registration_space(value: &str) -> Result<u32, String> {
    let space = value.parse::<u32>().map_err(|_| {
        format!(
            "Registration space must be an integer between {MIN_REGISTRATION_SPACE} and {MAX_REGISTRATION_SPACE} bytes"
        )
    })?;

    if !(MIN_REGISTRATION_SPACE..=MAX_REGISTRATION_SPACE).contains(&space) {
        return Err(format!(
            "Registration space must be between {MIN_REGISTRATION_SPACE} and {MAX_REGISTRATION_SPACE} bytes"
        ));
    }

    Ok(space)
}

#[derive(Debug, Subcommand)]
pub(crate) enum Commands {
    #[command(
        arg_required_else_help = true,
        about = "Resolve the owner of the specified domain names"
    )]
    Resolve {
        #[arg(required = true, help = "The list of .sns domains to resolve")]
        domain: Vec<String>,
        #[arg(long, short, help = "Optional custom RPC URL")]
        url: Option<String>,
    },
    #[command(
        arg_required_else_help = true,
        about = "Register the specified domain names"
    )]
    Register {
        #[arg(
            required = true,
            help = "The path to the wallet private key used to register the domains"
        )]
        keypair_path: String,
        #[arg(required = true, value_name = "BYTES", value_parser = parse_registration_space, help = "The number of bytes to allocate for each domain (1000 to 10000 inclusive)")]
        space: u32,
        #[arg(required = true, help = "The list of .sns domains to register")]
        domains: Vec<String>,
        #[arg(long, short, help = "Optional custom RPC URL")]
        url: Option<String>,
    },
    #[command(arg_required_else_help = true, about = "Set a primary domain")]
    SetPrimaryDomain {
        #[arg(
            required = true,
            help = "The path to the wallet private key used to set the primary domain"
        )]
        owner_keypair: String,
        #[arg(required = true, help = "The .sns domain to set as primary domain")]
        domain: String,
        #[arg(long, short, help = "Optional custom RPC URL")]
        url: Option<String>,
    },
    #[command(
        arg_required_else_help = true,
        about = "Transfer a list of domains to a new owner"
    )]
    Transfer {
        #[arg(
            required = true,
            help = "The path to the wallet private key which currently owns the domains to transfer"
        )]
        owner_keypair: String,
        #[arg(required = true, help = "The new owner of the domains")]
        new_owner: String,
        #[arg(required = true, help = "The list of .sns domains to transfer")]
        domain: Vec<String>,
        #[arg(long, short, help = "Optional custom RPC URL")]
        url: Option<String>,
    },
    #[command(
        arg_required_else_help = true,
        about = "⛔️ Burn a list of domain names"
    )]
    Burn {
        #[arg(
            required = true,
            help = "The path to the wallet private key which currently owns the domains to burn"
        )]
        keypair_path: String,
        #[arg(required = true, help = "The list of .sns domains to burn")]
        domain: Vec<String>,
        #[arg(long, short, help = "Optional custom RPC URL")]
        url: Option<String>,
    },
    #[command(
        arg_required_else_help = true,
        about = "Fetch the name registry data for the specified domain names"
    )]
    Lookup {
        #[arg(required = true, help = "The list of .sns domains to fetch")]
        domain: Vec<String>,
        #[arg(long, short, help = "Optional custom RPC URL")]
        url: Option<String>,
    },
    #[command(arg_required_else_help = true, about = "Perform a reverse lookup")]
    ReverseLookup {
        #[arg(required = true, help = "The public key (base58 encoded) to lookup")]
        key: String,
        #[arg(long, short, help = "Optional custom RPC URL")]
        url: Option<String>,
    },
    #[command(
        arg_required_else_help = true,
        about = "Fetch all the domain names owned for the specified wallets"
    )]
    Domains {
        #[arg(long, short, help = "Optional custom RPC URL")]
        url: Option<String>,
        #[arg(required = true, help = "The list of wallets")]
        owners: Vec<String>,
    },
    RecordV2(RecordV2Command),
    GetSubRegistrarInfo {
        #[arg(long, short, help = "Optional custom RPC URL")]
        url: Option<String>,
        #[arg(required = true, help = "The .sns domain to get information for")]
        domain: String,
    },
    Count(CountCommand),
}

#[derive(Debug, Args)]
pub(crate) struct RecordV2Command {
    #[command(subcommand)]
    pub(crate) cmd: RecordV2SubCommand,
    #[arg(long, short, help = "Optional custom RPC URL")]
    pub(crate) url: Option<String>,
}

#[derive(Debug, Subcommand)]
pub(crate) enum RecordV2SubCommand {
    #[command(about = "Gets a V2 record content")]
    Get {
        #[clap(long, help = "The .sns domain of the record to fetch")]
        domain: String,
        #[clap(long, help = "The record to fetch")]
        record: String,
    },
}

#[derive(Debug, Args)]
pub(crate) struct CountCommand {
    #[command(subcommand)]
    pub(crate) cmd: CountSubCommand,
    #[arg(long, short, help = "Optional custom RPC URL")]
    pub(crate) url: Option<String>,
}

#[derive(Debug, Subcommand)]
pub(crate) enum CountSubCommand {
    #[command(about = "Get registered domains")]
    RegisteredDomains,
    #[command(about = "GetRegisteredSubdomains")]
    SubDomains {
        #[clap(long, help = "Print the top n domains by number of subdomains")]
        top_domains: Option<usize>,
    },
}
