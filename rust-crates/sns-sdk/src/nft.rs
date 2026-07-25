use solana_program::pubkey::Pubkey;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SnsNftDomain {
    pub reverse: String,
    pub key: Pubkey,
    pub mint: Pubkey,
}
