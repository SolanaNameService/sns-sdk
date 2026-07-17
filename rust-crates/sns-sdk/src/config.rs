/// Enables SRS-backed `.sol` resolution.
///
/// This remains disabled until the complete SRS ownership path is available.
pub(crate) const SOL_SRS_RESOLUTION_ENABLED: bool = false;

/// First finalized slot where legacy SNS-backed `.sol` reads are disabled.
pub(crate) const SOL_TLD_CUTOFF_SLOT: u64 = 452_825_395;
