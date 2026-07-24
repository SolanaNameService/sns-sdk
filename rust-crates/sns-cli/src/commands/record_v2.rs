use crate::{commands::CliResult, domain::parse_sns_domain_key};
use anyhow::anyhow;
use console::Term;
use prettytable::{row, Table};
use sns_sdk::{
    non_blocking::{nft, record_v2, resolve},
    record::{record_v2::decode_record_v2_fields, Record},
};
use solana_client::nonblocking::rpc_client::RpcClient;

fn record_has_roa_verification(record: Record) -> bool {
    record.roa_validation() as u16 != 0
}

pub(crate) fn parse_record_arg(record: &str) -> anyhow::Result<Record> {
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

pub(crate) async fn process_record_v2_get(
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
