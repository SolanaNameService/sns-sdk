use solana_program::{pubkey, pubkey::Pubkey};

pub mod bindings;
mod config;
pub mod derivation;
pub mod error;
pub mod nft;
pub mod primary_domain;
pub mod tld;
mod utils;

pub mod record;
mod resolve;

#[cfg(not(feature = "blocking"))]
pub mod non_blocking;

#[cfg(feature = "blocking")]
pub mod blocking;

#[cfg(not(feature = "devnet"))]
pub const NAME_OFFERS_PROGRAM_ID: Pubkey = pubkey!("85iDfUvr3HJyLM2zcq5BXSiDvUWfw6cSE1FfNBo8Ap29");

#[cfg(feature = "devnet")]
pub const NAME_OFFERS_PROGRAM_ID: Pubkey = pubkey!("nameaSUMPQLdPzSimWStRKQyuwwiKscgWnZ6FSsT4zn");
