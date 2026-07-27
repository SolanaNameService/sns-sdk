<p align="center">
  <img width="200" src="https://www.sns.id/assets/logo/brand.svg" alt="SNS logo" />
</p>

# SNS Rust SDK

Rust APIs and instruction builders for resolving Solana Name Service (SNS) domains, reading records, discovering domain ownership, and composing SNS transactions.

> **Migrating from v1?** This release is not fully backward compatible. Review the [changelog](./CHANGELOG.md) for breaking changes and migration notes.

[![crates.io](https://img.shields.io/crates/v/sns-sdk.svg)](https://crates.io/crates/sns-sdk)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)

## Installation

The crate uses Rust 2021 and the Solana 2.1.x client stack. No MSRV or target-platform matrix is declared. Create and configure the RPC client in your application; the SDK does not own RPC transport, credentials, signing, or transaction submission.

The default build is asynchronous and exposes `sns_sdk::non_blocking`:

```toml
[dependencies]
sns-sdk = "2"
solana-client = "2.1"
solana-sdk = "2.1"
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }
```

For synchronous RPC APIs, disable default features and enable `blocking`. It exposes `sns_sdk::blocking` instead:

```toml
[dependencies]
sns-sdk = { version = "2", default-features = false, features = ["blocking"] }
solana-client = "2.1"
solana-sdk = "2.1"
```

`non_blocking` and `blocking` are mutually exclusive public RPC namespaces in a single feature build. The default async APIs need an async runtime such as Tokio. Shared parsing, derivation, and instruction-builder modules are available in either mode.

| Feature     | Default | Effect                                                                                          |
| ----------- | ------- | ----------------------------------------------------------------------------------------------- |
| `blocking`  | No      | Selects synchronous `blocking` RPC APIs instead of `non_blocking`.                              |
| `subdomain` | Yes     | Enables sub-registrar types and `get_sub_registrar_info`. `get_subdomains` is always available. |

## Quick Start

The examples below use the default asynchronous client and read the RPC endpoint from the `RPC_URL` environment variable. Each operation is shown separately so it can be adopted independently.

### Resolve A Domain

Use a full suffixed name. `resolve` returns the effective owner, applying SNS ownership precedence: an active tokenized-domain owner, then valid V2 and V1 `SOL` records, then the registry owner.

```rust
use sns_sdk::non_blocking::resolve::{resolve, AllowPda};
use solana_client::nonblocking::rpc_client::RpcClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let rpc_url = std::env::var("RPC_URL")?;
    let client = RpcClient::new(rpc_url);
    let owner = resolve(&client, "mydomain.sns", AllowPda::Deny).await?; // Or use `safe_resolve`.

    println!("{owner}");
    Ok(())
}
```

`AllowPda` governs only the fallback registry-owner path; it does not revalidate an owner returned earlier from a tokenized domain or `SOL` record:

- `AllowPda::Deny` rejects a fallback registry owner that is a PDA.
- `AllowPda::Allow(vec![program_id])` accepts a fallback PDA only when its runtime owner is in the supplied program list.
- `AllowPda::AllowAny` accepts a fallback PDA without checking its runtime owner.

If you are unsure, use `AllowPda::Deny`. Only allow PDAs when your application intentionally supports program-owned resolution targets.

### Get A Primary Domain

`get_primary_domain` returns the primary name-account key, or `None` when the wallet has no primary domain.

```rust
use sns_sdk::non_blocking::primary_domain::get_primary_domain;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let rpc_url = std::env::var("RPC_URL")?;
    let client = RpcClient::new(rpc_url);
    let wallet = Pubkey::from_str("<WALLET_ADDRESS>")?;
    let primary_domain = get_primary_domain(&client, &wallet).await?;

    println!("{primary_domain:?}");
    Ok(())
}
```

### List Domains For An Owner

`get_sns_domains_for_owner` returns directly owned top-level SNS name-account keys.

```rust
use sns_sdk::non_blocking::domain::get_sns_domains_for_owner;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let rpc_url = std::env::var("RPC_URL")?;
    let client = RpcClient::new(rpc_url);
    let wallet = Pubkey::from_str("<WALLET_ADDRESS>")?;
    let domains = get_sns_domains_for_owner(&client, wallet).await?;

    println!("{domains:?}");
    Ok(())
}
```

### Blocking Mode

With the `blocking` feature enabled, use the equivalent functions under `sns_sdk::blocking`, construct `solana_client::rpc_client::RpcClient`, and remove `.await` from each example.

## Domain Inputs And Resolution

`.sns` is the supported durable domain path.

| API category                          | Expected input                                | Examples                                          |
| ------------------------------------- | --------------------------------------------- | ------------------------------------------------- |
| High-level reads                      | Full suffixed domain                          | `mydomain.sns`, `sub.mydomain.sns`                |
| Writes                                | Lowercase, whitespace-free full `.sns` domain | `mydomain.sns`, `sub.mydomain.sns` for V2 records |
| SNS derivation and record-key helpers | TLD-trimmed name                              | `mydomain`, `sub.mydomain`                        |
| Raw name-registry builders            | Raw name or explicit account keys             | `mydomain`, `"\x01url"`, derived `Pubkey`         |

Registration only accepts a top-level `.sns` name. V2 record builders accept a top-level name or one subdomain level. Bare names and `.sol` are not write inputs.

For the current legacy `.sol` transition, full-domain read APIs use the legacy SNS-backed path only before the RPC endpoint reports finalized slot `452,825,395`. At or after that cutoff, `.sol` reads are rejected. This covers `resolve`, V1/V2 record getters, and enabled sub-registrar lookup. `.sol` writes are unsupported. `get_srs_domain_key` can derive an SRS address, but it does not mean high-level SRS resolution is enabled.

## API Reference

RPC-backed read APIs are available in the selected namespace: use `sns_sdk::non_blocking` with `.await` in the default build, or `sns_sdk::blocking` in a `blocking` build. Unless noted otherwise, the blocking API has the same arguments and result type. Derivation functions and instruction builders are shared across both modes.

### Resolution

- **`resolve::resolve`** — resolves a full `.sns` domain owner using the precedence described above.

  ```rust
  resolve::resolve(rpc_client: &RpcClient, domain: &str, allow_pda: AllowPda) -> Result<Pubkey, SnsError>
  ```

- **`resolve::safe_resolve`** — follows the same routing as `resolve`, except that when SRS-backed `.sol` resolution is enabled, it requires the `.sol` domain and its corresponding `.sns` domain to resolve to the same target; otherwise, it returns `SnsError::SnsSolResolutionMismatch`.

  ```rust
  resolve::safe_resolve(rpc_client: &RpcClient, domain: &str, allow_pda: AllowPda) -> Result<Pubkey, SnsError>
  ```

- **`resolve::resolve_name_registry`** — fetches one raw name-registry account.

  ```rust
  resolve::resolve_name_registry(rpc_client: &RpcClient, key: &Pubkey) -> Result<Option<(NameRecordHeader, Vec<u8>)>, SnsError>
  ```

- **`resolve::resolve_name_registry_batch`** — returns positional optional accounts.

  ```rust
  resolve::resolve_name_registry_batch(rpc_client: &RpcClient, keys: &[Pubkey]) -> Result<Vec<Option<(NameRecordHeader, Vec<u8>)>>, SnsError>
  ```

### Record Reads And Validation

`record::Record` is the input enum that selects the record kind. Use V2 records for new integrations. V1 records are legacy and largely deprecated; `record_v1::get_record` and `record::get_record_v1_key` remain available for compatibility with existing records.

- **`record_v2::get_record_v2`** — fetches one V2 record.

  ```rust
  record_v2::get_record_v2(rpc_client: &RpcClient, domain: &str, record: Record) -> Result<Option<(NameRecordHeader, Vec<u8>)>, SnsError>
  ```

- **`record_v2::get_multiple_records_v2`** — returns one optional result per input record.

  ```rust
  record_v2::get_multiple_records_v2(rpc_client: &RpcClient, domain: &str, records: &[Record]) -> Result<Vec<Option<(NameRecordHeader, Vec<u8>)>>, SnsError>
  ```

- **`record::record_v2::serialize_record_v2_content`** — validates and encodes human-readable content for a V2 record.

  ```rust
  record::record_v2::serialize_record_v2_content(content: &str, record: Record) -> Result<Vec<u8>, SnsError>
  ```

- **`record::record_v2::deserialize_record_v2_content`** — decodes stored V2 content into its human-readable representation.

  ```rust
  record::record_v2::deserialize_record_v2_content(content: &[u8], record: Record) -> Result<String, SnsError>
  ```

`None` from a getter means the record account does not exist. The returned `Vec<u8>` is the record payload after the SPL Name Registry header has been removed; it is not a `ParsedRecordV2`. Decode the payload with `record::record_v2::decode_record_v2_fields(&data)?.parse_content(record)`, then validate it against the domain's effective owner.

The following example fetches, decodes, and verifies a V2 `Url` record. It accounts for tokenized domain ownership before checking staleness and verifies the record's right of association:

```rust
use sns_sdk::{
    derivation::get_sns_domain_key,
    non_blocking::{
        nft::resolve_nft_owner,
        record_v2::get_record_v2,
        resolve::resolve_name_registry,
    },
    record::{record_v2::decode_record_v2_fields, Record},
};
use solana_client::nonblocking::rpc_client::RpcClient;
use std::io::{Error, ErrorKind};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let rpc_url = std::env::var("RPC_URL")?;
    let client = RpcClient::new(rpc_url);
    let domain = "mydomain.sns";
    let record = Record::Url;
    let domain_key = get_sns_domain_key("mydomain")?.key;

    let (_, record_data) = get_record_v2(&client, domain, record)
        .await?
        .ok_or_else(|| Error::new(ErrorKind::NotFound, "record not found"))?;
    let parsed = decode_record_v2_fields(&record_data)?.parse_content(record)?;

    let (domain_header, domain_data) = resolve_name_registry(&client, &domain_key)
        .await?
        .ok_or_else(|| Error::new(ErrorKind::NotFound, "domain not found"))?;
    let effective_owner = resolve_nft_owner(&client, &domain_key)
        .await?
        .unwrap_or(domain_header.owner);

    parsed.verify_staleness(effective_owner, Some(&domain_data))?;
    parsed.verify_roa()?;

    println!("{}", parsed.content);
    Ok(())
}
```

Not every record type requires right-of-association validation. Call `verify_roa()` when the selected record's validation policy requires it.

- **`record_v1::get_record`** — fetches a legacy V1 record. Use only when reading records that have not migrated to V2.

  ```rust
  record_v1::get_record(rpc_client: &RpcClient, domain: &str, record: Record) -> Result<Option<(NameRecordHeader, Vec<u8>)>, SnsError>
  ```

### Subdomains

- **`subdomain::get_subdomains`** — returns child labels. Derive `parent` with `get_sns_domain_key("parent")?.key`.

  ```rust
  subdomain::get_subdomains(rpc_client: &RpcClient, parent: &Pubkey) -> Result<Vec<String>, SnsError>
  ```

- **`subdomain::get_sub_registrar_info`** — returns sub-registrar state when the default `subdomain` feature is enabled.

  ```rust
  subdomain::get_sub_registrar_info(rpc_client: &RpcClient, domain: &str) -> Result<Registrar, SnsError>
  ```

### Ownership And Reverse Lookup

- **`domain::get_sns_domains_for_owner`** — returns directly owned top-level registry account keys; it does not enumerate tokenized ownership.

  ```rust
  domain::get_sns_domains_for_owner(rpc_client: &RpcClient, owner: Pubkey) -> Result<Vec<Pubkey>, SnsError>
  ```

- **`nft::get_sns_nfts_for_owner`** — returns tokenized domains whose `reverse`, `key`, and `mint` fields identify the domain and NFT.

  ```rust
  nft::get_sns_nfts_for_owner(rpc_client: &RpcClient, owner: &Pubkey) -> Result<Vec<SnsNftDomain>, SnsError>
  ```

- **`primary_domain::get_primary_domain`** — returns an optional primary name-account key, not a domain string.

  ```rust
  primary_domain::get_primary_domain(rpc_client: &RpcClient, owner: &Pubkey) -> Result<Option<Pubkey>, SnsError>
  ```

- **`resolve::resolve_reverse`** — looks up one TLD-less reverse name.

  ```rust
  resolve::resolve_reverse(rpc_client: &RpcClient, key: &Pubkey) -> Result<Option<String>, SnsError>
  ```

- **`resolve::resolve_reverse_batch`** — returns positional optional reverse names.

  ```rust
  resolve::resolve_reverse_batch(rpc_client: &RpcClient, keys: &[Pubkey]) -> Result<Vec<Option<String>>, SnsError>
  ```

### Derivation

- **`get_sns_domain_key`** — derives an SNS account from a TLD-trimmed name; read `.key` for the account and use `.parent` or `.is_sub` when required.

  ```rust
  get_sns_domain_key(domain: &str) -> Result<DomainKeyWithParent, SnsError>
  ```

- **`get_reverse_key`** — derives a reverse key from a TLD-trimmed name.

  ```rust
  get_reverse_key(domain: &str) -> Result<Pubkey, SnsError>
  ```

- **`get_domain_mint`** — derives the tokenized-domain mint.

  ```rust
  get_domain_mint(domain_key: &Pubkey) -> Pubkey
  ```

- **`get_srs_domain_key`** — derives an SRS key only; it does not enable SRS high-level resolution.

  ```rust
  get_srs_domain_key(domain: &str) -> SrsDomainKey
  ```

Mutation builders return `Instruction` or `Vec<Instruction>` values. Construct a transaction around the returned instruction(s), select its fee payer, fetch a recent blockhash, collect the signatures required by its account metas, and submit that transaction with the application's RPC client.

### Registration And Lifecycle

- **`bindings::register_domain::register_domain`**

  ```rust
  fn register_domain(
      domain: &str,
      space: u32,
      buyer: &Pubkey,
      buyer_token_account: &Pubkey,
      mint: Option<&Pubkey>,
      referrer_key: Option<&Pubkey>,
  ) -> Result<Vec<Instruction>, SnsError>
  ```

It accepts only canonical top-level `.sns` names. The builder supports its configured payment mints and price feeds; an unsupported mint fails. A referrer is used only when it is one of the configured allowlisted referrers.

- **`primary_domain::set_primary_domain_instruction`** — returns a primary-domain instruction from explicit accounts rather than a domain string.

  ```rust
  primary_domain::set_primary_domain_instruction(program_id: Pubkey, accounts: set_primary_domain::Accounts<Pubkey>, params: set_primary_domain::Params) -> Instruction
  ```

### Record Writes

`bindings::record_v2` provides six builders, each returning `Result<Instruction, SnsError>`:

- **`create_record_v2_instruction`**

  ```rust
  create_record_v2_instruction(domain: &str, record: Record, content: &str, owner: Pubkey, payer: Pubkey)
  ```

- **`update_record_v2_instruction`**

  ```rust
  update_record_v2_instruction(domain: &str, record: Record, content: &str, owner: Pubkey, payer: Pubkey)
  ```

- **`delete_record_v2`**

  ```rust
  delete_record_v2(domain: &str, record: Record, owner: Pubkey, payer: Pubkey)
  ```

- **`write_roa_record_v2`**

  ```rust
  write_roa_record_v2(domain: &str, record: Record, owner: Pubkey, payer: Pubkey, roa_id: Pubkey)
  ```

- **`validate_record_v2_content`**

  ```rust
  validate_record_v2_content(staleness: bool, domain: &str, record: Record, owner: Pubkey, payer: Pubkey, verifier: Pubkey)
  ```

- **`eth_validate_record_v2_content`**

  ```rust
  eth_validate_record_v2_content(domain: &str, record: Record, owner: Pubkey, payer: Pubkey, signature: Vec<u8>, expected_pubkey: Vec<u8>)
  ```

The transaction must provide signatures for the `owner` and `payer` account metas; `validate_record_v2_content` also marks `verifier` as a required signer. For Ethereum validation, `signature` is a 65-byte secp256k1 signature and `expected_pubkey` is a 20-byte Ethereum address; that proof is embedded in the instruction data rather than supplied by an on-chain verifier signer.

### Advanced APIs

- **`bindings::name_registry::create_name_registry`** — creates a raw name-registry account. `name` must include any record or subdomain prefix.

  ```rust
  bindings::name_registry::create_name_registry(name: &str, space: u32, lamports: u64, payer: Pubkey, owner: Pubkey, name_class: Option<Pubkey>, parent: Option<Pubkey>, parent_owner: Option<Pubkey>) -> Result<Instruction, SnsError>
  ```

- **`update_name_registry_data`** — updates explicit registry account data.

  ```rust
  update_name_registry_data(name_account: Pubkey, offset: u32, data: Vec<u8>, signer: Pubkey, parent: Option<Pubkey>) -> Result<Instruction, SnsError>
  ```

- **`transfer_name_ownership`** — transfers an explicit registry account.

  ```rust
  transfer_name_ownership(name_account: Pubkey, new_owner: Pubkey, current_owner: Pubkey, name_class: Option<Pubkey>) -> Result<Instruction, SnsError>
  ```

- **`delete_name_registry`** — deletes an explicit registry account and refunds its rent.

  ```rust
  delete_name_registry(name_account: Pubkey, owner: Pubkey, refund_target: Pubkey) -> Result<Instruction, SnsError>
  ```

These are advanced building blocks. Do not append `.sns` to raw-name inputs; derive or supply the correct account relationships and include the required signers when submitting the transaction.

## Documentation And Migration

- [Developer documentation](https://dev.sns.id/)
- [v2 migration guide](./CHANGELOG.md)
- [SNS monorepo overview](../../README.md)
- [SNS guide](https://guide.sns.id/)

## License

This project is available under the [MIT License](../../LICENSE).
