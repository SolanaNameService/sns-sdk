use clap::{Args, Parser, Subcommand};
use sns_sdk::record::Record;

pub(crate) fn parse_record_arg(record: &str) -> Result<Record, String> {
    if let Ok(record) = Record::try_from_str(record) {
        return Ok(record);
    }

    let normalized = match record.to_ascii_uppercase().as_str() {
        "EMAIL" => "email",
        "URL" => "url",
        "DISCORD" => "discord",
        "GITHUB" => "github",
        "REDDIT" => "reddit",
        "TWITTER" => "twitter",
        "TELEGRAM" => "telegram",
        "PIC" => "pic",
        "BACKPACK" => "backpack",
        "BIO" => "bio",
        "INJECTIVE" => "INJ",
        _ => record,
    };

    Record::try_from_str(normalized).map_err(|err| format!("{err:?}"))
}

#[derive(Debug, Parser)]
#[command(name = "sns")]
#[command(about = "Solana Name Service CLI", long_about = None)]
pub(crate) struct Cli {
    #[arg(global = true, long, short, help = "Optional custom RPC URL")]
    pub(crate) url: Option<String>,
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
    },
    #[command(arg_required_else_help = true, about = "Get or set a primary domain")]
    PrimaryDomain(PrimaryDomainCommand),
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
    },
    #[command(arg_required_else_help = true, about = "Burn a list of domain names")]
    Burn {
        #[arg(
            required = true,
            help = "The path to the wallet private key which currently owns the domains to burn"
        )]
        keypair_path: String,
        #[arg(required = true, help = "The list of .sns domains to burn")]
        domain: Vec<String>,
    },
    #[command(
        arg_required_else_help = true,
        about = "Fetch the name registry data for the specified domain names"
    )]
    Lookup {
        #[arg(required = true, help = "The list of .sns domains to fetch")]
        domain: Vec<String>,
    },
    #[command(arg_required_else_help = true, about = "Perform a reverse lookup")]
    ReverseLookup {
        #[arg(required = true, help = "The public key (base58 encoded) to lookup")]
        key: String,
    },
    #[command(
        arg_required_else_help = true,
        about = "Fetch all the domain names owned for the specified wallets"
    )]
    Domains {
        #[arg(required = true, help = "The list of wallets")]
        owners: Vec<String>,
    },
    RecordV2(RecordV2Command),
    SubRegistrar(SubRegistrarCommand),
    Count(CountCommand),
}

#[derive(Debug, Args)]
pub(crate) struct PrimaryDomainCommand {
    #[command(subcommand)]
    pub(crate) cmd: PrimaryDomainSubCommand,
}

#[derive(Debug, Subcommand)]
pub(crate) enum PrimaryDomainSubCommand {
    #[command(about = "Get an owner's primary domain")]
    Get {
        #[arg(
            required = true,
            help = "The wallet public key whose primary domain should be fetched"
        )]
        owner: String,
    },
    #[command(about = "Set a primary domain")]
    Set {
        #[arg(
            required = true,
            help = "The path to the wallet private key used to set the primary domain"
        )]
        owner_keypair: String,
        #[arg(required = true, help = "The .sns domain to set as primary domain")]
        domain: String,
    },
}

#[derive(Debug, Args)]
pub(crate) struct RecordV2Command {
    #[command(subcommand)]
    pub(crate) cmd: RecordV2SubCommand,
}

#[derive(Debug, Subcommand)]
pub(crate) enum RecordV2SubCommand {
    #[command(about = "Gets a V2 record content")]
    Get {
        #[clap(long, help = "The .sns domain of the record to fetch")]
        domain: String,
        #[arg(long, value_parser = parse_record_arg, help = "The record to fetch")]
        record: Record,
    },
    #[command(about = "Create or update a V2 record content")]
    Set {
        #[arg(
            long,
            help = "The path to the keypair that owns and pays for the record"
        )]
        keypair: String,
        #[arg(long, help = "The canonical .sns domain of the record to set")]
        domain: String,
        #[arg(long, value_parser = parse_record_arg, help = "The record to set")]
        record: Record,
        #[arg(long, allow_hyphen_values = true, help = "The content of the record")]
        content: String,
        #[arg(
            long,
            help = "Allow an update to clear existing or unreadable validation metadata"
        )]
        force: bool,
    },
}

#[derive(Debug, Args)]
pub(crate) struct SubRegistrarCommand {
    #[command(subcommand)]
    pub(crate) cmd: SubRegistrarSubCommand,
}

#[derive(Debug, Subcommand)]
pub(crate) enum SubRegistrarSubCommand {
    #[command(about = "Get sub-registrar information")]
    Get {
        #[arg(required = true, help = "The .sns domain to get information for")]
        domain: String,
    },
}

#[derive(Debug, Args)]
pub(crate) struct CountCommand {
    #[command(subcommand)]
    pub(crate) cmd: CountSubCommand,
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn global_url_accepts_root_command_and_nested_placements() {
        let root = Cli::try_parse_from([
            "sns",
            "--url",
            "https://root.example",
            "resolve",
            "bonfida.sns",
        ])
        .unwrap();
        assert_eq!(root.url.as_deref(), Some("https://root.example"));
        assert!(matches!(root.command, Commands::Resolve { domain } if domain == ["bonfida.sns"]));

        let former_local = Cli::try_parse_from([
            "sns",
            "resolve",
            "--url",
            "https://command.example",
            "bonfida.sns",
        ])
        .unwrap();
        assert_eq!(former_local.url.as_deref(), Some("https://command.example"));

        let nested = Cli::try_parse_from([
            "sns",
            "record-v2",
            "get",
            "--domain",
            "bonfida.sns",
            "--record",
            "url",
            "--url",
            "https://nested.example",
        ])
        .unwrap();
        assert_eq!(nested.url.as_deref(), Some("https://nested.example"));
        assert!(
            matches!(nested.command, Commands::RecordV2(RecordV2Command { cmd: RecordV2SubCommand::Get { domain, record } }) if domain == "bonfida.sns" && record.as_str() == "url")
        );
    }

    #[test]
    fn sub_registrar_get_replaces_legacy_top_level_command() {
        let cli = Cli::try_parse_from(["sns", "sub-registrar", "get", "bonfida.sns"]).unwrap();
        assert!(
            matches!(cli.command, Commands::SubRegistrar(SubRegistrarCommand { cmd: SubRegistrarSubCommand::Get { domain } }) if domain == "bonfida.sns")
        );
        assert!(Cli::try_parse_from(["sns", "get-sub-registrar-info", "bonfida.sns"]).is_err());
    }

    #[test]
    fn primary_domain_get_and_set_replace_legacy_top_level_command() {
        let get = Cli::try_parse_from([
            "sns",
            "primary-domain",
            "get",
            "11111111111111111111111111111111",
        ])
        .unwrap();
        assert!(matches!(
            get.command,
            Commands::PrimaryDomain(PrimaryDomainCommand {
                cmd: PrimaryDomainSubCommand::Get { owner }
            }) if owner == "11111111111111111111111111111111"
        ));

        let set =
            Cli::try_parse_from(["sns", "primary-domain", "set", "owner.json", "example.sns"])
                .unwrap();
        assert!(matches!(
            set.command,
            Commands::PrimaryDomain(PrimaryDomainCommand {
                cmd: PrimaryDomainSubCommand::Set {
                    owner_keypair,
                    domain
                }
            }) if owner_keypair == "owner.json" && domain == "example.sns"
        ));

        assert!(
            Cli::try_parse_from(["sns", "set-primary-domain", "owner.json", "example.sns"])
                .is_err()
        );
    }

    #[test]
    fn primary_domain_requires_all_operands() {
        assert!(Cli::try_parse_from(["sns", "primary-domain", "get"]).is_err());
        assert!(Cli::try_parse_from(["sns", "primary-domain", "set"]).is_err());
        assert!(Cli::try_parse_from(["sns", "primary-domain", "set", "owner.json"]).is_err());
    }

    #[test]
    fn primary_domain_accepts_global_url_at_nested_placements() {
        let root = Cli::try_parse_from([
            "sns",
            "--url",
            "https://root.example",
            "primary-domain",
            "get",
            "11111111111111111111111111111111",
        ])
        .unwrap();
        assert_eq!(root.url.as_deref(), Some("https://root.example"));

        let get = Cli::try_parse_from([
            "sns",
            "primary-domain",
            "get",
            "11111111111111111111111111111111",
            "--url",
            "https://get.example",
        ])
        .unwrap();
        assert_eq!(get.url.as_deref(), Some("https://get.example"));

        let set = Cli::try_parse_from([
            "sns",
            "primary-domain",
            "set",
            "owner.json",
            "example.sns",
            "--url",
            "https://set.example",
        ])
        .unwrap();
        assert_eq!(set.url.as_deref(), Some("https://set.example"));
    }

    #[test]
    fn record_parser_accepts_aliases_for_get_and_set() {
        let get = Cli::try_parse_from([
            "sns",
            "record-v2",
            "get",
            "--domain",
            "bonfida.sns",
            "--record",
            "URL",
        ])
        .unwrap();
        assert!(matches!(
            get.command,
            Commands::RecordV2(RecordV2Command {
                cmd: RecordV2SubCommand::Get { record, .. }
            }) if record.as_str() == "url"
        ));

        let set = Cli::try_parse_from([
            "sns",
            "record-v2",
            "set",
            "--keypair",
            "owner.json",
            "--domain",
            "bonfida.sns",
            "--record",
            "INJECTIVE",
            "--content",
            "inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49",
            "--force",
        ])
        .unwrap();
        assert!(matches!(
            set.command,
            Commands::RecordV2(RecordV2Command {
                cmd: RecordV2SubCommand::Set { record, force, .. }
            }) if record.as_str() == "INJ" && force
        ));

        assert!(Cli::try_parse_from([
            "sns",
            "record-v2",
            "set",
            "--keypair",
            "owner.json",
            "--domain",
            "bonfida.sns",
            "--record",
            "url",
        ])
        .is_err());
    }
}
