/** Seed prefix used when deriving Solana Registration Service accounts. */
export const SRS_HASH_PREFIX = "name";

/** Discriminator for an SRS record account. */
export const SRS_RECORD_DISCRIMINATOR = 2;

/** SRS owner type for a direct public-key owner. */
export const SRS_OWNER_TYPE_PUBKEY = 0;

/** SRS owner type for a tokenized domain mint. */
export const SRS_OWNER_TYPE_TOKEN = 1;

/** Size of an encoded Solana address in an SRS record. */
export const SRS_ADDRESS_LENGTH = 32;

/** Size of an SRS expiry timestamp. */
export const SRS_EXPIRY_LENGTH = 8;

/** Offset of the SRS record discriminator. */
export const SRS_RECORD_DISCRIMINATOR_OFFSET = 0;

/** Offset of the SRS record class address. */
export const SRS_RECORD_CLASS_OFFSET = SRS_RECORD_DISCRIMINATOR_OFFSET + 1;

/** Offset of the SRS record owner type. */
export const SRS_RECORD_OWNER_TYPE_OFFSET =
  SRS_RECORD_CLASS_OFFSET + SRS_ADDRESS_LENGTH;

/** Offset of the SRS record owner address or token mint. */
export const SRS_RECORD_OWNER_OFFSET = SRS_RECORD_OWNER_TYPE_OFFSET + 1;

/** Offset of the SRS record frozen flag. */
export const SRS_RECORD_FROZEN_OFFSET =
  SRS_RECORD_OWNER_OFFSET + SRS_ADDRESS_LENGTH;

/** Offset of the SRS record expiry timestamp. */
export const SRS_RECORD_EXPIRY_OFFSET = SRS_RECORD_FROZEN_OFFSET + 1;

/** Length of the fixed SRS record header. */
export const SRS_RECORD_HEADER_LENGTH =
  SRS_RECORD_EXPIRY_OFFSET + SRS_EXPIRY_LENGTH;

/** Offset of the Token-2022 metadata payload in an SRS record. */
export const SRS_RECORD_METADATA_OFFSET =
  SRS_RECORD_HEADER_LENGTH + 1 + SRS_ADDRESS_LENGTH;
