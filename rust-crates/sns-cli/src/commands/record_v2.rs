use crate::{commands::CliResult, domain::parse_sns_domain_key};
use anyhow::anyhow;
use console::Term;
use prettytable::{row, Table};
use sns_sdk::{
    bindings::record_v2::{create_record_v2_instruction, update_record_v2_instruction},
    non_blocking::{nft, record_v2, resolve},
    record::{
        record_v2::{decode_record_v2_fields, serialize_record_v2_content},
        Record,
    },
};
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_program::{instruction::Instruction, pubkey::Pubkey};
use solana_sdk::{
    signer::{keypair::read_keypair_file, Signer},
    transaction::Transaction,
};

fn record_has_roa_verification(record: Record) -> bool {
    record.roa_validation() as u16 != 0
}

pub(crate) async fn process_record_v2_get(
    rpc_client: &RpcClient,
    domain: &str,
    record: Record,
) -> CliResult {
    let domain_key = parse_sns_domain_key(domain)?.key;
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

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum RecordV2WriteAction {
    Create,
    Update,
}

impl RecordV2WriteAction {
    fn label(self) -> &'static str {
        match self {
            Self::Create => "Created",
            Self::Update => "Updated",
        }
    }
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum ValidationWarning {
    None,
    Reset,
    Unreadable,
}

fn select_record_v2_write_action(record_exists: bool) -> RecordV2WriteAction {
    if record_exists {
        RecordV2WriteAction::Update
    } else {
        RecordV2WriteAction::Create
    }
}

fn classify_validation_warning(record_data: &[u8]) -> ValidationWarning {
    match decode_record_v2_fields(record_data) {
        Ok(fields)
            if fields.staleness_validation as u16 != 0 || fields.roa_validation as u16 != 0 =>
        {
            ValidationWarning::Reset
        }
        Ok(_) => ValidationWarning::None,
        Err(_) => ValidationWarning::Unreadable,
    }
}

fn check_validation_overwrite(
    warning: ValidationWarning,
    force: bool,
) -> anyhow::Result<Option<&'static str>> {
    match (warning, force) {
        (ValidationWarning::None, _) => Ok(None),
        (ValidationWarning::Reset, false) => Err(anyhow!(
            "Refusing to update: the existing record contains validation metadata that would be cleared. Rerun with --force to overwrite it."
        )),
        (ValidationWarning::Unreadable, false) => Err(anyhow!(
            "Refusing to update: the existing record's validation metadata could not be decoded. Rerun with --force to overwrite it."
        )),
        (ValidationWarning::Reset, true) => Ok(Some(
            "Warning: --force will clear the existing record's staleness and right-of-association validation metadata.",
        )),
        (ValidationWarning::Unreadable, true) => Ok(Some(
            "Warning: --force will overwrite existing validation metadata that could not be decoded.",
        )),
    }
}

fn ensure_raw_domain_owner(signer: Pubkey, registry_owner: Pubkey) -> CliResult {
    if signer == registry_owner {
        Ok(())
    } else {
        Err(anyhow!(
            "Domain owner mismatch: signer is {signer}, registry owner is {registry_owner}"
        )
        .into())
    }
}

fn build_record_v2_write_instruction(
    action: RecordV2WriteAction,
    domain: &str,
    record: Record,
    content: &str,
    owner: Pubkey,
) -> anyhow::Result<Instruction> {
    match action {
        RecordV2WriteAction::Create => Ok(create_record_v2_instruction(
            domain, record, content, owner, owner,
        )?),
        RecordV2WriteAction::Update => Ok(update_record_v2_instruction(
            domain, record, content, owner, owner,
        )?),
    }
}

pub(crate) async fn process_record_v2_set(
    rpc_client: &RpcClient,
    keypair_path: &str,
    domain: &str,
    record: Record,
    content: &str,
    force: bool,
) -> CliResult {
    let domain_key = parse_sns_domain_key(domain)?.key;
    // Validate typed content before reading credentials or making RPC requests.
    serialize_record_v2_content(content, record)?;

    let keypair = read_keypair_file(keypair_path)?;
    let owner = keypair.pubkey();
    let (domain_header, _) = resolve::resolve_name_registry(rpc_client, &domain_key)
        .await?
        .ok_or_else(|| anyhow!("Domain not found"))?;
    ensure_raw_domain_owner(owner, domain_header.owner)?;

    let existing = record_v2::get_record_v2(rpc_client, domain, record).await?;
    let (action, warning) = match existing {
        Some((_, data)) => (
            select_record_v2_write_action(true),
            classify_validation_warning(&data),
        ),
        None => (
            select_record_v2_write_action(false),
            ValidationWarning::None,
        ),
    };
    if let Some(message) = check_validation_overwrite(warning, force)? {
        eprintln!("{message}");
    }
    let ix = build_record_v2_write_instruction(action, domain, record, content, owner)?;
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&owner),
        &[&keypair],
        rpc_client.get_latest_blockhash().await?,
    );
    let sig = rpc_client.send_and_confirm_transaction(&tx).await?;

    let mut table = Table::new();
    table.add_row(row![
        "Domain",
        "Record",
        "Action",
        "Transaction",
        "Explorer"
    ]);
    table.add_row(row![
        domain,
        record.as_str(),
        action.label(),
        sig,
        crate::output::make_tx_url(&sig.to_string())
    ]);
    table.printstd();
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn write_action_selects_create_or_update_and_uses_sdk_builders() {
        let owner = Pubkey::new_unique();
        let create = build_record_v2_write_instruction(
            RecordV2WriteAction::Create,
            "bonfida.sns",
            Record::Url,
            "https://sns.id",
            owner,
        )
        .unwrap();
        let update = build_record_v2_write_instruction(
            RecordV2WriteAction::Update,
            "bonfida.sns",
            Record::Url,
            "https://sns.id",
            owner,
        )
        .unwrap();
        assert_eq!(
            select_record_v2_write_action(false),
            RecordV2WriteAction::Create
        );
        assert_eq!(
            select_record_v2_write_action(true),
            RecordV2WriteAction::Update
        );
        assert_eq!(
            create,
            create_record_v2_instruction(
                "bonfida.sns",
                Record::Url,
                "https://sns.id",
                owner,
                owner
            )
            .unwrap()
        );
        assert_eq!(
            update,
            update_record_v2_instruction(
                "bonfida.sns",
                Record::Url,
                "https://sns.id",
                owner,
                owner
            )
            .unwrap()
        );
    }

    #[test]
    fn validation_warning_classifies_none_present_and_unreadable_metadata() {
        assert_eq!(
            classify_validation_warning(&[0; 8]),
            ValidationWarning::None
        );
        let mut validated = vec![1, 0, 0, 0, 0, 0, 0, 0];
        validated.extend_from_slice(&[0; 32]);
        assert_eq!(
            classify_validation_warning(&validated),
            ValidationWarning::Reset
        );
        assert_eq!(
            classify_validation_warning(&[]),
            ValidationWarning::Unreadable
        );
    }

    #[test]
    fn raw_owner_preflight_requires_the_registry_owner() {
        let signer = Pubkey::new_unique();
        assert!(ensure_raw_domain_owner(signer, signer).is_ok());
        assert!(ensure_raw_domain_owner(signer, Pubkey::new_unique()).is_err());
    }

    #[test]
    fn validation_metadata_requires_force_before_update() {
        assert_eq!(
            check_validation_overwrite(ValidationWarning::None, false).unwrap(),
            None
        );
        assert!(check_validation_overwrite(ValidationWarning::Reset, false).is_err());
        assert!(check_validation_overwrite(ValidationWarning::Unreadable, false).is_err());
        assert!(check_validation_overwrite(ValidationWarning::Reset, true)
            .unwrap()
            .is_some());
        assert!(
            check_validation_overwrite(ValidationWarning::Unreadable, true)
                .unwrap()
                .is_some()
        );
    }
}
