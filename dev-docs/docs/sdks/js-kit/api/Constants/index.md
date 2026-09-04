---
title: "Constants API"
sidebar_label: "Constants"
hide_title: true
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../index.md) / Constants

# Constants

Public SNS program addresses and protocol constants.

## Variables

| Variable | Description |
| ------ | ------ |
| [CENTRAL\_STATE](variables/CENTRAL_STATE.md) | Legacy alias for the reverse-lookup class address. |
| [CENTRAL\_STATE\_DOMAIN\_RECORDS](variables/CENTRAL_STATE_DOMAIN_RECORDS.md) | The central state address for domain records. |
| [DEFAULT\_ADDRESS](variables/DEFAULT_ADDRESS.md) | All-zero Solana address used as the SDK default sentinel. |
| [ETH\_ROA\_RECORDS](variables/ETH_ROA_RECORDS.md) | Record types that use Ethereum/secp256k1 Right of Association validation. |
| [EVM\_RECORDS](variables/EVM_RECORDS.md) | Record types whose content is a `0x`-prefixed EVM address. |
| [FIDA\_MINT](variables/FIDA_MINT.md) | Mainnet FIDA mint address. |
| [GUARDIANS](variables/GUARDIANS.md) | Maps record types to guardian addresses used for Right of Association verification. |
| [METAPLEX\_PROGRAM\_ADDRESS](variables/METAPLEX_PROGRAM_ADDRESS.md) | Address of the Metaplex Token Metadata program. |
| [NAME\_OFFERS\_ADDRESS](variables/NAME_OFFERS_ADDRESS.md) | The SNS Offers program address. |
| [NAME\_PROGRAM\_ADDRESS](variables/NAME_PROGRAM_ADDRESS.md) | The Solana Name Service program address. |
| [NAME\_TOKENIZER\_ADDRESS](variables/NAME_TOKENIZER_ADDRESS.md) | The SNS Name Tokenizer program address. |
| [PYTH\_FEEDS](variables/PYTH_FEEDS.md) | Maps supported payment mint addresses to their Pyth price-feed identifiers. |
| [PYTH\_PROGRAM\_ID](variables/PYTH_PROGRAM_ID.md) | Program address of the legacy Pyth oracle program. |
| [RECORDS\_PROGRAM\_ADDRESS](variables/RECORDS_PROGRAM_ADDRESS.md) | The SNS Records program address. |
| [REFERRERS](variables/REFERRERS.md) | Approved referrer addresses for SNS registration flows. |
| [REGISTRY\_PROGRAM\_ADDRESS](variables/REGISTRY_PROGRAM_ADDRESS.md) | The SNS Registry program address. |
| [REVERSE\_LOOKUP\_CLASS](variables/REVERSE_LOOKUP_CLASS.md) | The reverse lookup class address. |
| [SELF\_SIGNED\_RECORDS](variables/SELF_SIGNED_RECORDS.md) | Record types whose Right of Association verifier is derived from the record content itself. |
| [SNS\_ROOT\_DOMAIN\_ACCOUNT](variables/SNS_ROOT_DOMAIN_ACCOUNT.md) | The SNS root domain account address. |
| [SOL\_REGISTRAR\_PROGRAM\_ADDRESS](variables/SOL_REGISTRAR_PROGRAM_ADDRESS.md) | The SRS-backed.sol registry program address. |
| [SOL\_SRS\_CLASS](variables/SOL_SRS_CLASS.md) | The SRS class for `.sol` domains |
| [SRS\_ADDRESS\_LENGTH](variables/SRS_ADDRESS_LENGTH.md) | Size of an encoded Solana address in an SRS record. |
| [SRS\_CENTRAL\_STATE](variables/SRS_CENTRAL_STATE.md) | The SRS-backed.sol registry central state |
| [SRS\_EXPIRY\_LENGTH](variables/SRS_EXPIRY_LENGTH.md) | Size of an SRS expiry timestamp. |
| [SRS\_HASH\_PREFIX](variables/SRS_HASH_PREFIX.md) | Seed prefix used when deriving Solana Registration Service accounts. |
| [SRS\_OWNER\_TYPE\_PUBKEY](variables/SRS_OWNER_TYPE_PUBKEY.md) | SRS owner type for a direct public-key owner. |
| [SRS\_OWNER\_TYPE\_TOKEN](variables/SRS_OWNER_TYPE_TOKEN.md) | SRS owner type for a tokenized domain mint. |
| [SRS\_PROGRAM\_ADDRESS](variables/SRS_PROGRAM_ADDRESS.md) | The Solana Record Service (SRS) program address |
| [SRS\_RECORD\_CLASS\_OFFSET](variables/SRS_RECORD_CLASS_OFFSET.md) | Offset of the SRS record class address. |
| [SRS\_RECORD\_DISCRIMINATOR](variables/SRS_RECORD_DISCRIMINATOR.md) | Discriminator for an SRS record account. |
| [SRS\_RECORD\_DISCRIMINATOR\_OFFSET](variables/SRS_RECORD_DISCRIMINATOR_OFFSET.md) | Offset of the SRS record discriminator. |
| [SRS\_RECORD\_EXPIRY\_OFFSET](variables/SRS_RECORD_EXPIRY_OFFSET.md) | Offset of the SRS record expiry timestamp. |
| [SRS\_RECORD\_FROZEN\_OFFSET](variables/SRS_RECORD_FROZEN_OFFSET.md) | Offset of the SRS record frozen flag. |
| [SRS\_RECORD\_HEADER\_LENGTH](variables/SRS_RECORD_HEADER_LENGTH.md) | Length of the fixed SRS record header. |
| [SRS\_RECORD\_METADATA\_OFFSET](variables/SRS_RECORD_METADATA_OFFSET.md) | Offset of the Token-2022 metadata payload in an SRS record. |
| [SRS\_RECORD\_OWNER\_OFFSET](variables/SRS_RECORD_OWNER_OFFSET.md) | Offset of the SRS record owner address or token mint. |
| [SRS\_RECORD\_OWNER\_TYPE\_OFFSET](variables/SRS_RECORD_OWNER_TYPE_OFFSET.md) | Offset of the SRS record owner type. |
| [SYSTEM\_PROGRAM\_ADDRESS](variables/SYSTEM_PROGRAM_ADDRESS.md) | Address of the Solana System Program. |
| [SYSVAR\_RENT\_ADDRESS](variables/SYSVAR_RENT_ADDRESS.md) | Address of the rent sysvar account. |
| [TOKEN\_2022\_PROGRAM\_ADDRESS](variables/TOKEN_2022_PROGRAM_ADDRESS.md) | The SPL Token-2022 program address. |
| [TOKEN\_PROGRAM\_ADDRESS](variables/TOKEN_PROGRAM_ADDRESS.md) | Address of the SPL Token program. |
| [TWITTER\_ROOT\_PARENT\_REGISTRY\_ADDRESS](variables/TWITTER_ROOT_PARENT_REGISTRY_ADDRESS.md) | The `.twitter` root parent registry address. |
| [TWITTER\_VERIFICATION\_AUTHORITY](variables/TWITTER_VERIFICATION_AUTHORITY.md) | Address of the `.twitter` TLD authority. |
| [USDC\_MINT](variables/USDC_MINT.md) | Mainnet USDC mint address. |
| [UTF8\_ENCODED\_RECORDS](variables/UTF8_ENCODED_RECORDS.md) | Record types whose content is UTF-8 encoded. |
| [VAULT\_OWNER](variables/VAULT_OWNER.md) | Owner address of the SNS registration vault. |
| [WOLVES\_COLLECTION\_METADATA](variables/WOLVES_COLLECTION_METADATA.md) | Metadata account for the SNS Wolves collection. |
