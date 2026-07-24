use crate::{
    commands::CliResult,
    output::{make_tx_url, progress_bar},
};
use anyhow::anyhow;
use console::Term;
use prettytable::{row, Table};
use sns_sdk::{
    bindings::register_domain::{register_domain, USDC_MINT},
    tld::parse_sns_top_level_domain,
};
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_program::instruction::Instruction;
use solana_program::pubkey::Pubkey;
use solana_sdk::{
    signer::{keypair::read_keypair_file, Signer},
    transaction::Transaction,
};
use spl_associated_token_account::get_associated_token_address;
use std::sync::LazyLock;

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

pub(crate) fn build_register_instructions(
    domain: &str,
    space: u32,
    buyer: &Pubkey,
) -> InstructionResult {
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

pub(crate) async fn process_register(
    rpc_client: &RpcClient,
    keypair_path: &str,
    domains: Vec<String>,
    space: u32,
) -> CliResult {
    let keypair = read_keypair_file(keypair_path)?;
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
        tx.partial_sign(&[&keypair], rpc_client.get_latest_blockhash().await?);
        let sig = rpc_client.send_and_confirm_transaction(&tx).await?;
        table.add_row(row![domain, sig, make_tx_url(&sig.to_string())]);
        pb.set_position((idx + 1) as u64);
    }
    pb.finish();
    Term::stdout().clear_to_end_of_screen()?;
    table.printstd();
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use sns_sdk::bindings::register_domain::VAULT_OWNER;
    use solana_client::rpc_config::RpcSimulateTransactionConfig;
    use std::time::{SystemTime, UNIX_EPOCH};

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
        let res = rpc
            .simulate_transaction_with_config(
                &tx,
                RpcSimulateTransactionConfig {
                    sig_verify: false,
                    replace_recent_blockhash: true,
                    ..Default::default()
                },
            )
            .await
            .unwrap();
        assert!(
            res.value.err.is_none(),
            "registration simulation failed: {:?}",
            res.value
        );
    }
}
