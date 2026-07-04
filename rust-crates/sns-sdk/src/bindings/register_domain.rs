use bonfida_utils::InstructionsAccount;
use solana_program::{instruction::Instruction, pubkey, pubkey::Pubkey, sysvar};
use solana_sdk_ids::system_program;
use spl_associated_token_account::get_associated_token_address;

use crate::{
    derivation::{derive_reverse, get_sns_domain_key, ROOT_DOMAIN_ACCOUNT},
    error::SnsError,
    tld::parse_sns_top_level_domain,
};

pub use constants::*;

#[cfg(not(feature = "devnet"))]
mod constants {
    use super::*;

    pub const REGISTER_PROGRAM_ID: Pubkey = pubkey!("jCebN34bUfdeUYJT13J1yG16XWQpt5PDx6Mse9GUqhR");

    pub const REFERRERS: [Pubkey; 3] = [
        pubkey!("3ogYncmMM5CmytsGCqKHydmXmKUZ6sGWvizkzqwT7zb1"), // Test wallet
        pubkey!("DM1jJCkZZEwY5tmWbgvKRxsDFzXCdbfrYCCH1CtwguEs"), // 4Everland
        pubkey!("ADCp4QXFajHrhy4f43pD6GJFtQLkdBY2mjS9DfCk7tNW"), // Bandit network
    ];

    pub const USDC_MINT: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    pub const USDT_MINT: Pubkey = pubkey!("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");
    pub const SOL_MINT: Pubkey = pubkey!("So11111111111111111111111111111111111111112");
    pub const FIDA_MINT: Pubkey = pubkey!("EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp");
    pub const MSOL_MINT: Pubkey = pubkey!("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So");
    pub const BONK_MINT: Pubkey = pubkey!("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263");
    pub const BAT_MINT: Pubkey = pubkey!("EPeUFDgHRxs9xxEPVaL6kfGQvCon7jmAWKVUHuux1Tpz");
    pub const PYTH_MINT: Pubkey = pubkey!("HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3");
    pub const BSOL_MINT: Pubkey = pubkey!("bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1");
    pub const INJ_MINT: Pubkey = pubkey!("6McPRfPV6bY1e9hLxWyG54W9i9Epq75QBvXg2oetBVTB");
    pub const TRUMP_MINT: Pubkey = pubkey!("6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN");

    pub const DEFAULT_PYTH_PUSH_PROGRAM: Pubkey =
        pubkey!("pythWSnswVUd12oZpeFP8e9CVaEqJg25g1Vtc2biRsT");

    pub const PYTH_PULL_FEEDS: [(Pubkey, [u8; 32]); 11] = [
        (
            USDC_MINT,
            [
                234, 160, 32, 198, 28, 196, 121, 113, 40, 19, 70, 28, 225, 83, 137, 74, 150, 166,
                192, 11, 33, 237, 12, 252, 39, 152, 209, 249, 169, 233, 201, 74,
            ],
        ),
        (
            USDT_MINT,
            [
                43, 137, 185, 220, 143, 223, 159, 52, 112, 154, 91, 16, 107, 71, 47, 15, 57, 187,
                108, 169, 206, 4, 176, 253, 127, 46, 151, 22, 136, 226, 229, 59,
            ],
        ),
        (
            SOL_MINT,
            [
                239, 13, 139, 111, 218, 44, 235, 164, 29, 161, 93, 64, 149, 209, 218, 57, 42, 13,
                47, 142, 208, 198, 199, 188, 15, 76, 250, 200, 194, 128, 181, 109,
            ],
        ),
        (
            FIDA_MINT,
            [
                200, 6, 87, 183, 246, 243, 234, 194, 114, 24, 208, 157, 90, 78, 84, 228, 123, 37,
                118, 141, 159, 94, 16, 172, 21, 254, 44, 249, 0, 136, 20, 0,
            ],
        ),
        (
            MSOL_MINT,
            [
                194, 40, 154, 106, 67, 210, 206, 145, 198, 245, 92, 174, 195, 112, 244, 172, 195,
                138, 46, 212, 119, 245, 136, 19, 51, 76, 109, 3, 116, 159, 242, 164,
            ],
        ),
        (
            BONK_MINT,
            [
                114, 176, 33, 33, 124, 163, 254, 104, 146, 42, 25, 170, 249, 144, 16, 156, 185,
                216, 78, 154, 208, 4, 180, 210, 2, 90, 214, 245, 41, 49, 68, 25,
            ],
        ),
        (
            BAT_MINT,
            [
                142, 134, 15, 183, 78, 96, 229, 115, 107, 69, 93, 130, 246, 11, 55, 40, 4, 156, 52,
                142, 148, 150, 26, 221, 95, 150, 27, 2, 253, 238, 37, 53,
            ],
        ),
        (
            PYTH_MINT,
            [
                11, 191, 40, 233, 168, 65, 161, 204, 120, 143, 106, 54, 27, 23, 202, 7, 45, 14,
                163, 9, 138, 30, 93, 241, 195, 146, 45, 6, 113, 149, 121, 255,
            ],
        ),
        (
            BSOL_MINT,
            [
                137, 135, 83, 121, 231, 15, 143, 186, 220, 23, 174, 243, 21, 173, 243, 168, 213,
                209, 96, 184, 17, 67, 85, 55, 224, 60, 151, 232, 170, 201, 125, 156,
            ],
        ),
        (
            INJ_MINT,
            [
                122, 91, 193, 210, 181, 106, 208, 41, 4, 140, 214, 57, 100, 179, 173, 39, 118, 234,
                223, 129, 46, 220, 26, 67, 163, 20, 6, 203, 84, 191, 245, 146,
            ],
        ),
        (
            TRUMP_MINT,
            [
                135, 149, 81, 2, 24, 83, 238, 199, 167, 220, 130, 117, 120, 232, 230, 157, 167,
                228, 250, 129, 72, 51, 154, 160, 211, 213, 41, 100, 5, 190, 75, 26,
            ],
        ),
    ];

    pub const VAULT_OWNER: Pubkey = pubkey!("5D2zKog251d6KPCyFyLMt3KroWwXXPWSgTPyhV22K2gR");
}

#[cfg(feature = "devnet")]
mod constants {
    use super::*;

    pub const REGISTER_PROGRAM_ID: Pubkey = pubkey!("snshBoEQ9jx4QoHBpZDQPYdNCtw7RMxJvYrKFEhwaPJ");

    pub const REFERRERS: [Pubkey; 3] = [
        pubkey!("3ogYncmMM5CmytsGCqKHydmXmKUZ6sGWvizkzqwT7zb1"), // Test wallet
        pubkey!("DM1jJCkZZEwY5tmWbgvKRxsDFzXCdbfrYCCH1CtwguEs"), // 4Everland
        pubkey!("ADCp4QXFajHrhy4f43pD6GJFtQLkdBY2mjS9DfCk7tNW"), // Bandit network
    ];

    pub const USDC_MINT: Pubkey = pubkey!("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
    pub const USDT_MINT: Pubkey = pubkey!("EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS");
    pub const SOL_MINT: Pubkey = pubkey!("So11111111111111111111111111111111111111112");
    pub const FIDA_MINT: Pubkey = pubkey!("fidaWCioBQjieRrUQDxxS5Uxmq1CLi2VuVRyv4dEBey");
    pub const INJ_MINT: Pubkey = pubkey!("DL4ivZm3NVHWk9ZvtcqTchxoKArDK4rT3vbDx2gYVr7P");

    pub const DEFAULT_PYTH_PUSH_PROGRAM: Pubkey =
        pubkey!("pythWSnswVUd12oZpeFP8e9CVaEqJg25g1Vtc2biRsT");

    pub const PYTH_PULL_FEEDS: [(Pubkey, [u8; 32]); 0] = [];

    pub const VAULT_OWNER: Pubkey = pubkey!("SNSaTJbEv2iT3CUrCQYa9zpGjbBVWhFCPaSJHkaJX34");
}

pub enum ProgramInstruction {
    CreateSplitV2 = 20,
}

pub mod create {
    use bonfida_utils::{BorshSize, InstructionsAccount};
    use borsh::{BorshDeserialize, BorshSerialize};
    use solana_sdk::pubkey::Pubkey;

    #[derive(BorshDeserialize, BorshSerialize, BorshSize, Debug)]
    /// The required parameters for the `create split v2` instruction
    pub struct Params {
        pub name: String,
        pub space: u32,
        pub referrer_idx_opt: Option<u16>,
    }

    #[derive(InstructionsAccount)]
    /// The required accounts for the `create split v2` instruction
    pub struct Accounts<'a, T> {
        /// The naming service program ID
        pub naming_service_program: &'a T,
        /// The root domain account
        pub root_domain: &'a T,
        /// The name account
        #[cons(writable)]
        pub name: &'a T,
        /// The reverse look up account
        #[cons(writable)]
        pub reverse_lookup: &'a T,
        /// The system program account
        pub system_program: &'a T,
        /// The central state account
        pub central_state: &'a T,
        /// The buyer account
        #[cons(writable, signer)]
        pub buyer: &'a T,
        /// The domain owner account
        pub domain_owner: &'a T,
        /// The fee payer account
        #[cons(writable, signer)]
        pub fee_payer: &'a T,
        /// The buyer token account
        #[cons(writable)]
        pub buyer_token_source: &'a T,
        /// The Pyth pull-feed account
        pub pyth_feed_account: &'a T,
        /// The vault account
        #[cons(writable)]
        pub vault: &'a T,
        /// The SPL token program
        pub spl_token_program: &'a T,
        /// The rent sysvar account
        pub rent_sysvar: &'a T,
        /// The state auction account
        pub state: &'a T,
        /// The *optional* referrer token account to receive a portion of fees.
        /// The token account owner has to be whitelisted.
        #[cons(writable)]
        pub referrer_account_opt: Option<&'a T>,
    }
}

pub fn get_register_instruction(
    program_id: Pubkey,
    accounts: create::Accounts<Pubkey>,
    params: create::Params,
) -> Instruction {
    accounts.get_instruction(program_id, ProgramInstruction::CreateSplitV2 as u8, params)
}

pub fn get_pyth_feed_account_key(shard: u16, price_feed: &[u8; 32]) -> Pubkey {
    let shard = shard.to_le_bytes();
    Pubkey::find_program_address(&[&shard, price_feed], &DEFAULT_PYTH_PUSH_PROGRAM).0
}

pub fn register_domain(
    domain: &str,
    space: u32,
    buyer: &Pubkey,
    buyer_token_account: &Pubkey,
    mint: Option<&Pubkey>,
    referrer_key: Option<&Pubkey>,
) -> Result<Vec<Instruction>, SnsError> {
    let central_state =
        Pubkey::find_program_address(&[REGISTER_PROGRAM_ID.as_ref()], &REGISTER_PROGRAM_ID).0;
    let name = parse_sns_top_level_domain(domain)?;
    let name_account = get_sns_domain_key(&name)?.key;
    let reverse_lookup_account = derive_reverse(&name_account, None);
    let derived_state =
        Pubkey::find_program_address(&[name_account.as_ref()], &REGISTER_PROGRAM_ID).0;
    let referrer_idx = if let Some(referrer) = referrer_key {
        REFERRERS
            .iter()
            .enumerate()
            .find_map(|(i, k)| if k == referrer { Some(i as u16) } else { None })
    } else {
        None
    };
    let mint = mint.unwrap_or(&USDC_MINT);
    let mut instructions = vec![];
    let referrer_token_account = if let (Some(referrer_key), Some(_)) = (referrer_key, referrer_idx)
    {
        let referrer_token_account = get_associated_token_address(referrer_key, mint);
        instructions.push(
            spl_associated_token_account::instruction::create_associated_token_account_idempotent(
                buyer,
                referrer_key,
                mint,
                &spl_token::ID,
            ),
        );
        Some(referrer_token_account)
    } else {
        None
    };
    let pyth_feed = PYTH_PULL_FEEDS
        .iter()
        .find_map(|(m, feed)| if m == mint { Some(feed) } else { None })
        .ok_or(SnsError::UnsupportedMint)?;
    let pyth_feed_account = get_pyth_feed_account_key(0, pyth_feed);
    let vault = get_associated_token_address(&VAULT_OWNER, mint);
    instructions.push(get_register_instruction(
        REGISTER_PROGRAM_ID,
        create::Accounts {
            naming_service_program: &spl_name_service::ID,
            root_domain: &ROOT_DOMAIN_ACCOUNT,
            name: &name_account,
            reverse_lookup: &reverse_lookup_account,
            system_program: &system_program::ID,
            central_state: &central_state,
            buyer,
            domain_owner: buyer,
            fee_payer: buyer,
            buyer_token_source: buyer_token_account,
            pyth_feed_account: &pyth_feed_account,
            vault: &vault,
            spl_token_program: &spl_token::ID,
            rent_sysvar: &sysvar::rent::ID,
            state: &derived_state,
            referrer_account_opt: referrer_token_account.as_ref(),
        },
        create::Params {
            name,
            space,
            referrer_idx_opt: referrer_idx,
        },
    ));
    Ok(instructions)
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::utils::test::generate_random_string;
    use dotenv::dotenv;
    use solana_client::rpc_client::RpcClient;
    use solana_sdk::{message::Message, transaction::Transaction};

    #[test]
    fn test_registration_requires_top_level_sns() {
        let buyer_token_account = get_associated_token_address(&VAULT_OWNER, &SOL_MINT);

        assert!(matches!(
            register_domain(
                "domain",
                1_000,
                &VAULT_OWNER,
                &buyer_token_account,
                Some(&SOL_MINT),
                None,
            ),
            Err(SnsError::UnsupportedTld)
        ));
        assert!(matches!(
            register_domain(
                "domain.sol",
                1_000,
                &VAULT_OWNER,
                &buyer_token_account,
                Some(&SOL_MINT),
                None,
            ),
            Err(SnsError::UnsupportedTld)
        ));
        assert!(matches!(
            register_domain(
                "sub.domain.sns",
                1_000,
                &VAULT_OWNER,
                &buyer_token_account,
                Some(&SOL_MINT),
                None,
            ),
            Err(SnsError::SubdomainNotAllowed)
        ));
        assert!(matches!(
            register_domain(
                "Domain.sns",
                1_000,
                &VAULT_OWNER,
                &buyer_token_account,
                Some(&SOL_MINT),
                None,
            ),
            Err(SnsError::InvalidDomainCasing)
        ));
    }

    #[test]
    fn test_registration() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let instructions = register_domain(
            &format!("{}.sns", generate_random_string(10)),
            1_000,
            &VAULT_OWNER,
            &get_associated_token_address(&VAULT_OWNER, &SOL_MINT),
            Some(&SOL_MINT),
            None,
        )
        .unwrap();
        let message = Message::new(&instructions, Some(&VAULT_OWNER));
        let mut tx = Transaction::new_unsigned(message);
        tx.message.recent_blockhash = client.get_latest_blockhash().unwrap();
        let res = client.simulate_transaction(&tx).unwrap();
        assert!(
            res.value.err.is_none(),
            "registration err: {:?}\nregistration logs: {:#?}",
            res.value.err,
            res.value.logs
        )
    }

    #[test]
    fn test_registration_ref() {
        dotenv().ok();
        let client = RpcClient::new(std::env::var("RPC_URL").unwrap());
        let instructions = register_domain(
            &format!("{}.sns", generate_random_string(10)),
            1_000,
            &VAULT_OWNER,
            &get_associated_token_address(&VAULT_OWNER, &SOL_MINT),
            Some(&SOL_MINT),
            Some(&REFERRERS[2]),
        )
        .unwrap();
        let message = Message::new(&instructions, Some(&VAULT_OWNER));
        let mut tx = Transaction::new_unsigned(message);
        tx.message.recent_blockhash = client.get_latest_blockhash().unwrap();
        let res = client.simulate_transaction(&tx).unwrap();
        assert!(
            res.value.err.is_none(),
            "registration ref err: {:?}\nregistration ref logs: {:#?}",
            res.value.err,
            res.value.logs
        )
    }
}
