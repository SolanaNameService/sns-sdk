use std::io::ErrorKind;

use bonfida_utils::InstructionsAccount;
use borsh::BorshDeserialize;
use solana_program::pubkey::Pubkey;
use solana_sdk::instruction::Instruction;

use crate::NAME_OFFERS_PROGRAM_ID;

pub fn derive_primary_domain_key(owner: &Pubkey) -> Pubkey {
    Pubkey::find_program_address(
        // Preserve the original on-chain PDA seed spelling for compatibility with
        // existing primary-domain accounts.
        &[b"favourite_domain", &owner.to_bytes()],
        &NAME_OFFERS_PROGRAM_ID,
    )
    .0
}

#[derive(BorshDeserialize)]
pub enum Tag {
    _A,
    _B,
    _C,
    _D,
    PrimaryDomain = 4,
}

#[derive(BorshDeserialize)]
pub struct PrimaryDomain {
    pub tag: Tag,
    pub name_account: Pubkey,
}

impl PrimaryDomain {
    pub fn parse(mut buffer: &[u8]) -> Result<PrimaryDomain, std::io::Error> {
        let s = Self::deserialize(&mut buffer)?;
        if !matches!(s.tag, Tag::PrimaryDomain) {
            Err(std::io::Error::new(ErrorKind::InvalidData, ""))
        } else {
            Ok(s)
        }
    }
}

pub mod set_primary_domain {
    use bonfida_utils::{BorshSize, InstructionsAccount};
    use borsh::{BorshDeserialize, BorshSerialize};
    use solana_sdk::pubkey::Pubkey;

    #[derive(InstructionsAccount)]
    /// The required accounts for the `create` instruction
    pub struct Accounts<'a, T> {
        /// The name account
        #[cons(writable)]
        pub name: &'a T,
        #[cons(writable)]
        pub primary_domain: &'a T,
        #[cons(writable, signer)]
        pub owner: &'a T,
        pub system_program: &'a T,
    }

    #[derive(BorshDeserialize, BorshSerialize, BorshSize, Clone, Copy)]
    #[repr(C)]
    pub struct Params {}
}

pub fn set_primary_domain_instruction(
    program_id: Pubkey,
    accounts: set_primary_domain::Accounts<Pubkey>,
    params: set_primary_domain::Params,
) -> Instruction {
    accounts.get_instruction(program_id, 6, params)
}
