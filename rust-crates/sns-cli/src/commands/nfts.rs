use crate::{
    commands::CliResult,
    output::{display_reverse_domain, progress_bar},
};
use console::Term;
use prettytable::{row, Table};
use sns_sdk::non_blocking::nft;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_program::pubkey::Pubkey;
use std::str::FromStr;

pub(crate) async fn process_nfts(rpc_client: &RpcClient, owners: Vec<String>) -> CliResult {
    println!("Fetching NFT domains...\n");
    let mut table = Table::new();
    table.add_row(row!["Domain", "Owner", "Mint", "Link"]);
    let pb = progress_bar(owners.len());
    for (idx, owner) in owners.into_iter().enumerate() {
        let owner_key = Pubkey::from_str(&owner)?;
        let nft_domains = nft::get_sns_nfts_for_owner(rpc_client, &owner_key).await?;
        nft_domains.into_iter().for_each(|domain| {
            let displayed = display_reverse_domain(&domain.reverse);
            table.add_row(row![
                displayed,
                owner,
                domain.mint,
                format!("https://www.sns.id/domain/{}", domain.reverse)
            ]);
        });
        pb.set_position(idx as u64);
    }
    pb.finish();
    Term::stdout().clear_to_end_of_screen()?;
    table.printstd();
    Ok(())
}
