use crate::{cli::CountSubCommand, commands::CliResult};
use anyhow::anyhow;
use serde::Serialize;
use sns_sdk::derivation::ROOT_DOMAIN_ACCOUNT;
use solana_account_decoder::{UiAccountEncoding, UiDataSliceConfig};
use solana_client::{
    nonblocking::rpc_client::RpcClient,
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, RpcFilterType},
};
use solana_program::program_pack::Pack;
use solana_program::pubkey::Pubkey;
use spl_name_service::state::NameRecordHeader;
use std::collections::{BTreeSet, HashMap};

pub(crate) async fn process_count_command(
    rpc_client: &RpcClient,
    count_type: CountSubCommand,
) -> CliResult {
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
                if name_record.class != NULL_PUBKEY {
                    continue;
                }
                name_accounts
                    .entry(name_record.parent_name)
                    .or_default()
                    .push(key);
            }
            let domains = name_accounts
                .get(&ROOT_DOMAIN_ACCOUNT)
                .ok_or_else(|| anyhow!("Root domain account not found"))?;
            let mut total_number_of_subdomains = 0;
            let mut number_of_domains_with_subdomains = 0;
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
            println!(
                "{}",
                serde_json::to_string_pretty(&Result {
                    number_of_domains: domains.len(),
                    number_of_subdomains: total_number_of_subdomains,
                    top_domains,
                    number_of_domains_with_subdomains
                })?
            );
        }
    }
    Ok(())
}
