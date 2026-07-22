use serde::Serialize;
use sns_sdk::{
    bindings::register_domain::{register_domain, USDC_MINT},
    derivation::{get_sns_domain_key, DomainKeyWithParent, ROOT_DOMAIN_ACCOUNT},
    error::SnsError,
    primary_domain::set_primary_domain::Accounts,
    tld::{parse_sns_domain, parse_sns_top_level_domain},
    NAME_OFFERS_PROGRAM_ID,
};
use solana_account_decoder::{UiAccountEncoding, UiDataSliceConfig};
use solana_client::{
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, RpcFilterType},
};
use solana_sdk_ids::system_program;
use std::{
    collections::{BTreeSet, HashMap},
    sync::LazyLock,
};

use {
    anyhow::anyhow,
    clap::Args,
    clap::{Parser, Subcommand},
    console::Term,
    indicatif::{ProgressBar, ProgressState, ProgressStyle},
    prettytable::{row, Table},
    sns_sdk::non_blocking::{domain, nft, record_v2, resolve},
    sns_sdk::record::{record_v2::decode_record_v2_fields, Record},
    solana_client::nonblocking::rpc_client::RpcClient,
    solana_program::instruction::Instruction,
    solana_program::program_pack::Pack,
    solana_program::pubkey::Pubkey,
    solana_sdk::signer::keypair::read_keypair_file,
    solana_sdk::{signer::Signer, transaction::Transaction},
    spl_associated_token_account::get_associated_token_address,
    spl_name_service::state::NameRecordHeader,
    std::fmt::Write,
    std::str::FromStr,
};

#[derive(Debug, Parser)]
#[command(name = "sns")]
#[command(about = "Solana Name Service CLI", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Debug, Subcommand)]
enum Commands {
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
        #[arg(
            required = true,
            help = "The space to allocate for each domain (1kB to 10kB"
        )]
        space: u64,
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
pub struct RecordV2Command {
    #[command(subcommand)]
    pub cmd: RecordV2SubCommand,
    #[arg(long, short, help = "Optional custom RPC URL")]
    url: Option<String>,
}

#[derive(Debug, Subcommand)]
pub enum RecordV2SubCommand {
    #[command(about = "Gets a V2 record content")]
    Get {
        #[clap(long, help = "The .sns domain of the record to fetch")]
        domain: String,
        #[clap(long, help = "The record to fetch")]
        record: String,
    },
}

#[derive(Debug, Args)]
pub struct CountCommand {
    #[command(subcommand)]
    pub cmd: CountSubCommand,
    #[arg(long, short, help = "Optional custom RPC URL")]
    url: Option<String>,
}

#[derive(Debug, Subcommand)]
pub enum CountSubCommand {
    #[command(about = "Get registered domains")]
    RegisteredDomains,
    #[command(about = "GetRegisteredSubdomains")]
    SubDomains {
        #[clap(long, help = "Print the top n domains by number of subdomains")]
        top_domains: Option<usize>,
    },
}

const DEFAULT_RPC_URL: &str = "https://api.mainnet-beta.solana.com";

fn select_rpc_url(cli_url: Option<String>, env_url: Option<String>) -> String {
    cli_url
        .or_else(|| env_url.filter(|url| !url.trim().is_empty()))
        .unwrap_or_else(|| DEFAULT_RPC_URL.to_string())
}

fn get_rpc_client(url: Option<String>) -> RpcClient {
    let env_url = std::env::var("RPC_URL").ok();
    RpcClient::new(select_rpc_url(url, env_url))
}

fn display_reverse_domain(domain: &str) -> String {
    if domain.ends_with(".sns") {
        domain.to_string()
    } else {
        format!("{domain}.sns")
    }
}

fn display_registry_data(data: &[u8]) -> String {
    let data = data
        .iter()
        .rposition(|byte| *byte != 0)
        .map(|last_non_zero| &data[..=last_non_zero])
        .unwrap_or_default();

    String::from_utf8_lossy(data).to_string()
}

fn record_has_roa_verification(record: Record) -> bool {
    record.roa_validation() as u16 != 0
}

fn parse_record_arg(record: &str) -> anyhow::Result<Record> {
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

    Record::try_from_str(normalized).map_err(|err| anyhow!("{err:?}"))
}

fn make_tx_url(sig: &str) -> String {
    format!("https://explorer.solana.com/tx/{sig}")
}

pub fn progress_bar(len: usize) -> ProgressBar {
    let pb = ProgressBar::new(len as u64);
    pb.set_style(
        ProgressStyle::with_template(
            "{spinner:.green} [{elapsed_precise}] [{wide_bar:.cyan/blue}] ({eta})",
        )
        .unwrap()
        .with_key("eta", |state: &ProgressState, w: &mut dyn Write| {
            write!(w, "{:.1}s", state.eta().as_secs_f64()).unwrap()
        })
        .progress_chars("#>-"),
    );
    pb
}

type CliResult = Result<(), Box<dyn std::error::Error>>;

fn parse_sns_domain_key(domain: &str) -> Result<DomainKeyWithParent, SnsError> {
    let domain_name = parse_sns_domain(domain)?;
    get_sns_domain_key(&domain_name)
}

async fn process_domains(rpc_client: &RpcClient, owners: Vec<String>) -> CliResult {
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

async fn process_resolve(rpc_client: &RpcClient, domains: Vec<String>) -> CliResult {
    println!("Resolving domains...\n");
    let mut table = Table::new();
    table.add_row(row!["Domain", "Owner", "Explorer"]);

    let pb = progress_bar(domains.len());
    for (idx, domain) in domains.into_iter().enumerate() {
        parse_sns_domain(&domain)?;
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

async fn process_burn(
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
        let blockhash = rpc_client.get_latest_blockhash().await?;
        tx.partial_sign(&[&keypair], blockhash);
        let sig = rpc_client.send_and_confirm_transaction(&tx).await?;

        table.add_row(row![domain, sig, make_tx_url(&sig.to_string())]);
        pb.set_position(idx as u64);
    }
    pb.finish();
    Term::stdout().clear_to_end_of_screen()?;
    table.printstd();
    Ok(())
}

async fn process_transfer(
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
        let blockhash = rpc_client.get_latest_blockhash().await?;
        tx.partial_sign(&[&keypair], blockhash);
        let sig = rpc_client.send_and_confirm_transaction(&tx).await?;
        table.add_row(row![domain, sig, make_tx_url(&sig.to_string())]);
        pb.set_position(idx as u64);
    }
    pb.finish();
    Term::stdout().clear_to_end_of_screen()?;
    table.printstd();
    Ok(())
}

async fn process_lookup(rpc_client: &RpcClient, domains: Vec<String>) -> CliResult {
    println!("Fetching information...\n");
    let mut table = Table::new();
    table.add_row(row!["Domain", "Domain key", "Parent", "Owner", "Data"]);
    let pb = progress_bar(domains.len());
    for (idx, domain) in domains.into_iter().enumerate() {
        let DomainKeyWithParent {
            key: domain_key,
            parent,
            is_sub: _,
        } = parse_sns_domain_key(&domain)?;
        let row = match resolve::resolve_name_registry(rpc_client, &domain_key).await? {
            Some((header, data)) => {
                let data = display_registry_data(&data);
                row![domain, domain_key, header.parent_name, header.owner, data]
            }
            _ => row![domain, domain_key, parent, "N/A", "N/A"],
        };
        table.add_row(row);
        pb.set_position(idx as u64);
    }
    pb.finish();
    Term::stdout().clear_to_end_of_screen()?;
    table.printstd();
    Ok(())
}

async fn process_reverse_lookup(rpc_client: &RpcClient, key: &str) -> CliResult {
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

type InstructionResult = Result<Vec<Instruction>, Box<dyn std::error::Error>>;

static VALID_REGISTRATION_NAME: LazyLock<regex::Regex> =
    LazyLock::new(|| regex::Regex::new(r"^[a-z\d\-_]+$").unwrap());

fn validate_registration_domain(domain: &str) -> Result<(), Box<dyn std::error::Error>> {
    let registration_name = parse_sns_top_level_domain(domain)?;
    if !VALID_REGISTRATION_NAME.is_match(&registration_name) {
        return Err(anyhow!(
            "CLI registrations only support lowercase letters, digits, hyphens, and underscores"
        )
        .into());
    }

    Ok(())
}

fn validate_registration_space(space: u64) -> Result<u32, Box<dyn std::error::Error>> {
    Ok(u32::try_from(space).map_err(|_| anyhow!("Registration space must fit in a u32 value"))?)
}

fn build_register_instructions(domain: &str, space: u32, buyer: &Pubkey) -> InstructionResult {
    let buyer_token_account = get_associated_token_address(buyer, &USDC_MINT);
    Ok(register_domain(
        domain,
        space,
        buyer,
        &buyer_token_account,
        None,
        None,
    )?)
}

async fn process_register(
    rpc_client: &RpcClient,
    keypair_path: &str,
    domains: Vec<String>,
    space: u64,
) -> CliResult {
    let keypair = read_keypair_file(keypair_path)?;
    let space = validate_registration_space(space)?;
    for domain in &domains {
        validate_registration_domain(domain)?;
    }

    println!("Registering domains...");
    let mut table = Table::new();
    table.add_row(row!["Domain", "Transaction", "Explorer"]);
    let pb = progress_bar(domains.len());

    for (idx, domain) in domains.into_iter().enumerate() {
        let ixs = build_register_instructions(&domain, space, &keypair.pubkey())?;

        let mut tx = Transaction::new_with_payer(&ixs, Some(&keypair.pubkey()));
        let blockhash = rpc_client.get_latest_blockhash().await?;
        tx.partial_sign(&[&keypair], blockhash);
        let sig = rpc_client.send_and_confirm_transaction(&tx).await?;
        table.add_row(row![domain, sig, make_tx_url(&sig.to_string())]);
        pb.set_position((idx + 1) as u64);
    }
    pb.finish();
    Term::stdout().clear_to_end_of_screen()?;
    table.printstd();
    Ok(())
}

async fn process_set_primary_domain(
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
    let blockhash = rpc_client.get_latest_blockhash().await?;
    let tx = Transaction::new_signed_with_payer(&[ix], Some(&owner), &[&owner_keypair], blockhash);
    let sig = rpc_client.send_and_confirm_transaction(&tx).await?;
    println!("Primary domain set, txid: {sig}");

    Ok(())
}

async fn process_record_v2_get(
    rpc_client: &RpcClient,
    domain: &str,
    record_str: &str,
) -> CliResult {
    let domain_key = parse_sns_domain_key(domain)?.key;
    let record = parse_record_arg(record_str)?;

    let Some((_, data)) = record_v2::get_record_v2(rpc_client, domain, record).await? else {
        return Err(anyhow!("Record not found").into());
    };

    let parsed = decode_record_v2_fields(&data)?.parse_content(record)?;
    let (domain_header, domain_data) = resolve::resolve_name_registry(rpc_client, &domain_key)
        .await?
        .ok_or_else(|| anyhow!("Domain not found"))?;
    let effective_owner = nft::resolve_nft_owner(rpc_client, &domain_key)
        .await?
        .unwrap_or(domain_header.owner);

    let staleness_verified = parsed
        .verify_staleness(effective_owner, Some(&domain_data))
        .is_ok();
    let roa_verified = if record_has_roa_verification(record) {
        parsed.verify_roa().is_ok().to_string()
    } else {
        "N/A".to_string()
    };

    let mut table = Table::new();
    table.add_row(row![
        "Domain",
        "Record",
        "Content",
        "Staleness Verified",
        "RoA Verified"
    ]);
    table.add_row(row![
        domain,
        record.as_str(),
        parsed.content,
        staleness_verified,
        roa_verified
    ]);
    Term::stdout().clear_to_end_of_screen()?;
    table.printstd();

    Ok(())
}

async fn process_sub_registrar_info(rpc_client: &RpcClient, domain: &str) -> CliResult {
    parse_sns_domain(domain)?;
    let registrar =
        sns_sdk::non_blocking::subdomain::get_sub_registrar_info(rpc_client, domain).await?;
    println!("{registrar:#?}");
    Ok(())
}

async fn process_count_command(rpc_client: &RpcClient, count_type: CountSubCommand) -> CliResult {
    let (filters, data_slice) = match count_type {
        CountSubCommand::RegisteredDomains => (
            Some(vec![RpcFilterType::Memcmp(Memcmp::new_raw_bytes(
                0,
                ROOT_DOMAIN_ACCOUNT.to_bytes().to_vec(),
            ))]),
            Some(UiDataSliceConfig {
                offset: 0,
                length: 0,
            }),
        ),
        CountSubCommand::SubDomains { .. } => (
            None,
            Some(UiDataSliceConfig {
                offset: 0,
                length: NameRecordHeader::LEN,
            }),
        ),
    };
    let accounts = rpc_client
        .get_program_accounts_with_config(
            &spl_name_service::ID,
            RpcProgramAccountsConfig {
                filters,
                account_config: RpcAccountInfoConfig {
                    data_slice,
                    encoding: Some(UiAccountEncoding::Base64Zstd),
                    ..Default::default()
                },
                ..Default::default()
            },
        )
        .await?;
    match count_type {
        CountSubCommand::RegisteredDomains => println!("{}", accounts.len()),
        CountSubCommand::SubDomains { top_domains } => {
            let mut name_accounts = HashMap::<Pubkey, Vec<Pubkey>>::with_capacity(accounts.len());
            const NULL_PUBKEY: Pubkey = Pubkey::new_from_array([0; 32]);
            for (key, account) in accounts {
                let name_record = NameRecordHeader::unpack_unchecked(&account.data)?;
                use std::collections::hash_map::Entry;
                if name_record.class != NULL_PUBKEY {
                    continue;
                }
                match name_accounts.entry(name_record.parent_name) {
                    Entry::Occupied(mut occupied_entry) => occupied_entry.get_mut().push(key),
                    Entry::Vacant(vacant_entry) => {
                        vacant_entry.insert(vec![key]);
                    }
                }
            }
            let domains = name_accounts
                .get(&ROOT_DOMAIN_ACCOUNT)
                .ok_or_else(|| anyhow!("Root domain account not found"))?;
            let mut total_number_of_subdomains: usize = 0;
            let mut number_of_domains_with_subdomains: usize = 0;
            let mut top_domains = top_domains.map(|n| (n, BTreeSet::new()));
            for d in domains {
                let number_of_subdomains =
                    name_accounts.get(d).map(|v| v.len()).unwrap_or_default();
                if number_of_subdomains != 0 {
                    number_of_domains_with_subdomains += 1;
                }
                if let Some((max_size, top_domains)) = top_domains.as_mut() {
                    top_domains.insert((number_of_subdomains, *d));
                    if &top_domains.len() > max_size {
                        top_domains.pop_first();
                    }
                }
                total_number_of_subdomains += number_of_subdomains;
            }

            let top_domains = top_domains.map(|(_, s)| {
                s.into_iter()
                    .rev()
                    .map(|(k, v)| (v.to_string(), k))
                    .collect::<Vec<_>>()
            });

            #[derive(Serialize)]
            struct Result {
                number_of_domains: usize,
                number_of_subdomains: usize,
                number_of_domains_with_subdomains: usize,
                top_domains: Option<Vec<(String, usize)>>,
            }

            let result = serde_json::to_string_pretty(&Result {
                number_of_domains: domains.len(),
                number_of_subdomains: total_number_of_subdomains,
                top_domains,
                number_of_domains_with_subdomains,
            })?;
            println!("{result}");
        }
    }
    Ok(())
}

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
            process_sub_registrar_info(&get_rpc_client(url), domain.as_str()).await
        }
        Commands::Count(CountCommand { cmd, url }) => {
            process_count_command(&get_rpc_client(url), cmd).await
        }
    };

    if let Err(err) = res {
        eprintln!("Error: {err:?}")
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use sns_sdk::bindings::register_domain::VAULT_OWNER;
    use solana_client::rpc_config::RpcSimulateTransactionConfig;
    use std::time::{SystemTime, UNIX_EPOCH};

    #[test]
    fn parse_sns_domain_key_uses_bare_name_derivation() {
        for (full_domain, bare_name) in [
            ("bonfida.sns", "bonfida"),
            ("dex.bonfida.sns", "dex.bonfida"),
        ] {
            let actual = parse_sns_domain_key(full_domain).unwrap();
            let expected = get_sns_domain_key(bare_name).unwrap();

            assert_eq!(actual.key, expected.key);
            assert_eq!(actual.parent, expected.parent);
            assert_eq!(actual.is_sub, expected.is_sub);
        }
    }

    #[test]
    fn parse_sns_domain_key_rejects_noncanonical_inputs() {
        for domain in ["bonfida", "bonfida.sol", "bonfida.eth"] {
            assert!(matches!(
                parse_sns_domain_key(domain),
                Err(SnsError::UnsupportedTld)
            ));
        }
        for domain in ["Bonfida.sns", " bonfida.sns"] {
            assert!(matches!(
                parse_sns_domain_key(domain),
                Err(SnsError::InvalidDomainCasing)
            ));
        }
        assert!(matches!(
            parse_sns_domain_key("bonfida.sns "),
            Err(SnsError::UnsupportedTld)
        ));
        for domain in [".sns", "bonfida..sns", "too.deep.bonfida.sns"] {
            assert!(matches!(
                parse_sns_domain_key(domain),
                Err(SnsError::InvalidDomain)
            ));
        }
    }

    #[test]
    fn display_reverse_domain_adds_sns_suffix_once() {
        assert_eq!(display_reverse_domain("bonfida"), "bonfida.sns");
        assert_eq!(display_reverse_domain("bonfida.sns"), "bonfida.sns");
    }

    #[tokio::test]
    async fn register_instructions_simulate() {
        let rpc_url = match std::env::var("RPC_URL") {
            Ok(url) => url,
            Err(_) => return,
        };
        let rpc = RpcClient::new(rpc_url);
        let suffix = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis();
        let domain = format!("cli-rust-sdk-sim-{suffix}.sns");
        let ixs = build_register_instructions(&domain, 1_000, &VAULT_OWNER).unwrap();
        let tx = Transaction::new_with_payer(&ixs, Some(&VAULT_OWNER));
        let config = RpcSimulateTransactionConfig {
            sig_verify: false,
            replace_recent_blockhash: true,
            ..Default::default()
        };
        let res = rpc
            .simulate_transaction_with_config(&tx, config)
            .await
            .unwrap();
        assert!(
            res.value.err.is_none(),
            "registration simulation failed: {:?}",
            res.value
        );
    }
}
