use crate::commands::CliResult;
use anyhow::anyhow;
use prettytable::{row, Table};
use sns_sdk::{
    derivation::{get_sns_domain_key, ROOT_DOMAIN_ACCOUNT},
    error::SnsError,
    non_blocking::{nft, primary_domain as primary_domain_reader, resolve},
    primary_domain::{
        derive_primary_domain_key, set_primary_domain::Accounts, set_primary_domain::Params,
        set_primary_domain_instruction,
    },
    tld::parse_sns_top_level_domain,
    NAME_OFFERS_PROGRAM_ID,
};
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_program::{instruction::Instruction, pubkey::Pubkey};
use solana_sdk::{
    signer::{keypair::read_keypair_file, Signer},
    transaction::Transaction,
};
use solana_sdk_ids::system_program;
use spl_name_service::state::NameRecordHeader;
use std::str::FromStr;

fn primary_domain_parent(header: &NameRecordHeader) -> Option<Pubkey> {
    (header.parent_name != ROOT_DOMAIN_ACCOUNT).then_some(header.parent_name)
}

fn ensure_top_level_parent(header: &NameRecordHeader) -> anyhow::Result<()> {
    if header.parent_name == ROOT_DOMAIN_ACCOUNT {
        Ok(())
    } else {
        Err(anyhow!(
            "Unsupported or malformed primary-domain parent ancestry"
        ))
    }
}

fn is_primary_domain_stale(
    requested_owner: Pubkey,
    raw_registry_owner: Pubkey,
    nft_owner: Option<Pubkey>,
) -> bool {
    requested_owner != nft_owner.unwrap_or(raw_registry_owner)
}

fn format_primary_domain(child_reverse: &str, parent_reverse: Option<&str>) -> String {
    let child = child_reverse.strip_suffix(".sns").unwrap_or(child_reverse);
    match parent_reverse {
        Some(parent) => {
            let parent = parent.strip_suffix(".sns").unwrap_or(parent);
            format!("{child}.{parent}.sns")
        }
        None => format!("{child}.sns"),
    }
}

fn parse_primary_domain_set_key(domain: &str) -> Result<Pubkey, SnsError> {
    let bare_name = parse_sns_top_level_domain(domain)?;
    Ok(get_sns_domain_key(&bare_name)?.key)
}

fn ensure_primary_domain_settable(signer: Pubkey, header: &NameRecordHeader) -> CliResult {
    if signer != header.owner {
        return Err(anyhow!(
            "Domain owner mismatch: signer is {signer}, registry owner is {}",
            header.owner
        )
        .into());
    }
    if header.parent_name != ROOT_DOMAIN_ACCOUNT {
        return Err(SnsError::SubdomainNotAllowed.into());
    }
    Ok(())
}

fn build_set_primary_domain_instruction(owner: Pubkey, name: Pubkey) -> Instruction {
    set_primary_domain_instruction(
        NAME_OFFERS_PROGRAM_ID,
        Accounts {
            name: &name,
            primary_domain: &derive_primary_domain_key(&owner),
            owner: &owner,
            system_program: &system_program::ID,
        },
        Params {},
    )
}

pub(crate) async fn process_get_primary_domain(rpc_client: &RpcClient, owner: &str) -> CliResult {
    let requested_owner = Pubkey::from_str(owner)?;
    let Some(name_account) =
        primary_domain_reader::get_primary_domain(rpc_client, &requested_owner).await?
    else {
        println!("No primary domain set");
        return Ok(());
    };

    let (header, _) = resolve::resolve_name_registry(rpc_client, &name_account)
        .await?
        .ok_or_else(|| anyhow!("Primary domain registry not found"))?;
    let domain = match primary_domain_parent(&header) {
        None => {
            let reverse = resolve::resolve_reverse_with_parent(rpc_client, &name_account, None)
                .await?
                .ok_or_else(|| anyhow!("Primary domain reverse record not found"))?;
            format_primary_domain(&reverse, None)
        }
        Some(parent) => {
            let (parent_header, _) = resolve::resolve_name_registry(rpc_client, &parent)
                .await?
                .ok_or_else(|| anyhow!("Primary domain parent registry not found"))?;
            ensure_top_level_parent(&parent_header)?;
            let child_reverse =
                resolve::resolve_reverse_with_parent(rpc_client, &name_account, Some(&parent))
                    .await?
                    .ok_or_else(|| anyhow!("Primary domain child reverse record not found"))?;
            let parent_reverse = resolve::resolve_reverse(rpc_client, &parent)
                .await?
                .ok_or_else(|| anyhow!("Primary domain parent reverse record not found"))?;
            format_primary_domain(&child_reverse, Some(&parent_reverse))
        }
    };
    let nft_owner = nft::resolve_nft_owner(rpc_client, &name_account).await?;
    let stale = is_primary_domain_stale(requested_owner, header.owner, nft_owner);

    let mut table = Table::new();
    table.add_row(row!["Requested Owner", "Domain", "Name Account", "Stale"]);
    table.add_row(row![requested_owner, domain, name_account, stale]);
    table.printstd();
    Ok(())
}

pub(crate) async fn process_set_primary_domain(
    rpc_client: &RpcClient,
    owner_keypair_path: &str,
    domain: &str,
) -> CliResult {
    let domain_key = parse_primary_domain_set_key(domain)?;
    let owner_keypair = read_keypair_file(owner_keypair_path)?;
    let owner = owner_keypair.pubkey();
    let (header, _) = resolve::resolve_name_registry(rpc_client, &domain_key)
        .await?
        .ok_or_else(|| anyhow!("Domain not found"))?;
    ensure_primary_domain_settable(owner, &header)?;

    let ix = build_set_primary_domain_instruction(owner, domain_key);
    println!("Setting primary domain...");
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

#[cfg(test)]
mod tests {
    use super::*;

    fn registry_header(parent_name: Pubkey, owner: Pubkey) -> NameRecordHeader {
        NameRecordHeader {
            parent_name,
            owner,
            class: Pubkey::default(),
        }
    }

    #[test]
    fn stale_uses_nft_owner_then_raw_registry_owner() {
        let requested = Pubkey::new_unique();
        let other = Pubkey::new_unique();
        assert!(!is_primary_domain_stale(requested, requested, None));
        assert!(is_primary_domain_stale(requested, other, None));
        assert!(!is_primary_domain_stale(requested, other, Some(requested)));
        assert!(is_primary_domain_stale(requested, requested, Some(other)));
    }

    #[test]
    fn reverse_names_render_one_canonical_sns_suffix() {
        assert_eq!(format_primary_domain("example", None), "example.sns");
        assert_eq!(format_primary_domain("example.sns", None), "example.sns");
        assert_eq!(
            format_primary_domain("team", Some("example")),
            "team.example.sns"
        );
        assert_eq!(
            format_primary_domain("team", Some("example.sns")),
            "team.example.sns"
        );
    }

    #[test]
    fn topology_uses_sns_root_and_rejects_deeper_ancestry() {
        assert_ne!(ROOT_DOMAIN_ACCOUNT, Pubkey::default());
        let top_level = registry_header(ROOT_DOMAIN_ACCOUNT, Pubkey::new_unique());
        assert_eq!(primary_domain_parent(&top_level), None);

        let child = registry_header(Pubkey::default(), Pubkey::new_unique());
        assert_eq!(primary_domain_parent(&child), Some(Pubkey::default()));
        assert!(ensure_top_level_parent(&child).is_err());
        assert!(ensure_top_level_parent(&top_level).is_ok());
    }

    #[test]
    fn set_preflight_requires_raw_owner_and_top_level_registry() {
        let signer = Pubkey::new_unique();
        let valid = registry_header(ROOT_DOMAIN_ACCOUNT, signer);
        assert!(ensure_primary_domain_settable(signer, &valid).is_ok());

        let registry_owner = Pubkey::new_unique();
        let mismatch = registry_header(ROOT_DOMAIN_ACCOUNT, registry_owner);
        let error = ensure_primary_domain_settable(signer, &mismatch).unwrap_err();
        let message = error.to_string();
        assert!(message.contains(&signer.to_string()));
        assert!(message.contains(&registry_owner.to_string()));

        let child = registry_header(Pubkey::new_unique(), signer);
        let error = ensure_primary_domain_settable(signer, &child).unwrap_err();
        assert!(matches!(
            error.downcast_ref::<SnsError>(),
            Some(SnsError::SubdomainNotAllowed)
        ));
    }

    #[test]
    fn set_input_uses_canonical_top_level_domain_parser() {
        assert_eq!(
            parse_primary_domain_set_key("example.sns").unwrap(),
            get_sns_domain_key("example").unwrap().key
        );
        assert!(matches!(
            parse_primary_domain_set_key("team.example.sns"),
            Err(SnsError::SubdomainNotAllowed)
        ));
        assert!(matches!(
            parse_primary_domain_set_key("example"),
            Err(SnsError::UnsupportedTld)
        ));
        assert!(matches!(
            parse_primary_domain_set_key("example.sol"),
            Err(SnsError::UnsupportedTld)
        ));
        assert!(matches!(
            parse_primary_domain_set_key("Example.sns"),
            Err(SnsError::InvalidDomainCasing)
        ));
        assert!(matches!(
            parse_primary_domain_set_key(" example.sns"),
            Err(SnsError::InvalidDomainCasing)
        ));
        assert!(matches!(
            parse_primary_domain_set_key(".sns"),
            Err(SnsError::InvalidDomain)
        ));
    }

    #[test]
    fn set_instruction_delegates_to_sdk_builder() {
        let owner = Pubkey::new_unique();
        let name = Pubkey::new_unique();
        let instruction = build_set_primary_domain_instruction(owner, name);
        let expected = set_primary_domain_instruction(
            NAME_OFFERS_PROGRAM_ID,
            Accounts {
                name: &name,
                primary_domain: &derive_primary_domain_key(&owner),
                owner: &owner,
                system_program: &system_program::ID,
            },
            Params {},
        );

        assert_eq!(instruction, expected);
        assert_eq!(instruction.program_id, NAME_OFFERS_PROGRAM_ID);
        assert_eq!(instruction.accounts[0].pubkey, name);
        assert_eq!(
            instruction.accounts[1].pubkey,
            derive_primary_domain_key(&owner)
        );
        assert_eq!(instruction.accounts[2].pubkey, owner);
        assert_eq!(instruction.accounts[3].pubkey, system_program::ID);
    }
}
