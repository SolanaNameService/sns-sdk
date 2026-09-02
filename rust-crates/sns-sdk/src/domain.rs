use solana_program::pubkey::Pubkey;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SolDomain {
    pub domain: String,
    pub key: Pubkey,
}
