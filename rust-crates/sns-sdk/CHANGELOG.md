# Rust SDK v2.0.0

This is a breaking release of `sns-sdk`.

Use this changelog as a migration guide from v1 to v2.

## Table of contents

1. [Domain suffix handling](#1-domain-suffix-handling)
2. [.sol resolution transition](#2-sol-resolution-transition)
3. [Renamed public APIs](#3-renamed-public-apis)
4. [Blocking and non-blocking modules](#4-blocking-and-non-blocking-modules)
5. [Resolve migration](#5-resolve-migration)
6. [Record migration](#6-record-migration)
7. [Domain registration migration](#7-domain-registration-migration)
8. [Tokenized domain migration](#8-tokenized-domain-migration)
9. [Primary domain migration](#9-primary-domain-migration)
10. [Removed APIs](#10-removed-apis)

## 1. Domain suffix handling

v2 standardizes domain inputs. APIs that work with domains no longer accept ambiguous bare names like `mydomain`, unless they are low-level raw name-account APIs.

### Read APIs

These are the public functions that contact a Solana RPC client and take a complete domain string. They now require a full domain with a supported suffix. Use `.sns`; bare names such as `mydomain` return `SnsError::UnsupportedTld`.

Affected APIs:

- `non_blocking::resolve::resolve`
- `blocking::resolve::resolve`
- `non_blocking::record_v1::get_record`
- `blocking::record_v1::get_record`
- `non_blocking::record_v2::get_record_v2`
- `blocking::record_v2::get_record_v2`
- `non_blocking::record_v2::get_multiple_records_v2`
- `blocking::record_v2::get_multiple_records_v2`
- `non_blocking::subdomain::get_sub_registrar_info`
- `blocking::subdomain::get_sub_registrar_info`

```rust
let owner = sns_sdk::non_blocking::resolve::resolve(&client, "mydomain.sns", AllowPda::Deny).await?;
```

`.sol` is accepted by these APIs only during a transition window. See section 2 for the cutoff behavior; do not treat `.sol` as a permanent `.sns` alias.

### Write APIs

Write APIs accept a lowercase, whitespace-free, full `.sns` domain only:

- `bindings::register_domain::register_domain`
- `bindings::record_v2::create_record_v2_instruction`
- `bindings::record_v2::update_record_v2_instruction`
- `bindings::record_v2::delete_record_v2`
- `bindings::record_v2::write_roa_record_v2`
- `bindings::record_v2::validate_record_v2_content`
- `bindings::record_v2::eth_validate_record_v2_content`

Input rules:

- registration accepts top-level names only (`mydomain.sns`);
- V2 record builders accept a top-level name or one subdomain level (`mydomain.sns`, `sub.mydomain.sns`);
- bare names and `.sol` are not valid write inputs.

Use canonical `.sns` names:

```rust
"mydomain.sns";
"sub.mydomain.sns";
```

Do not pass:

```rust
"mydomain";
"mydomain.sol";
"MyDomain.sns";
" mydomain.sns";
```

### Key derivation APIs

Key derivation was reorganized. Update calls using this map:

| v1                                       | v2 / action                                           |
| ---------------------------------------- | ----------------------------------------------------- |
| `derivation::get_domain_key`             | `derivation::get_sns_domain_key(...).key`             |
| `derivation::get_domain_key_with_parent` | `derivation::get_sns_domain_key`                      |
| `derivation::trim_tld`                   | removed; choose the correct input contract explicitly |
| no v1 equivalent                         | `derivation::get_srs_domain_key`                      |

These derivation helpers take a TLD-trimmed name (for example `mydomain` or `sub.mydomain`, not `mydomain.sns`):

- `derivation::get_sns_domain_key`
- `derivation::get_reverse_key`
- `record::get_record_key`
- `record::get_record_v1_key`
- `record::get_record_v2_key`

`DomainKeyWithParent` now also carries `is_sub`. Callers that used `get_domain_key` to get a `Pubkey` must read the `.key` field of the returned `DomainKeyWithParent`:

```rust
// v1
let key = sns_sdk::derivation::get_domain_key("sub.mydomain")?;

// v2
let key = sns_sdk::derivation::get_sns_domain_key("sub.mydomain")?.key;
```

### Raw name-account APIs

These low-level APIs take raw names or explicit account keys, not full domain strings. Do not append `.sns` to their inputs:

- `bindings::name_registry::create_name_registry` — raw name
- `bindings::name_registry::update_name_registry_data` — account key
- `bindings::name_registry::transfer_name_ownership` — account key
- `bindings::name_registry::delete_name_registry` — account key
- `primary_domain::set_primary_domain_instruction` — explicit account list (`program_id`, `Accounts`, `Params`); it does not take a domain string

For example, use `"mydomain"` rather than `"mydomain.sns"` when directly creating a raw name account.

## 2. `.sol` resolution transition

The high-level Read APIs in section 1 handle `.sol` differently depending on the cluster's finalized slot:

- before finalized slot `452_825_395`, high-level `.sol` calls use the legacy SNS-backed path;
- at or after that cutoff, those `.sol` reads are rejected;
- this applies to every full-domain Read API in section 1, including domain resolution and the V1/V2 record getters.

```text
name.sns                         -> SNS read path
name.sol before cutoff           -> legacy SNS-backed fallback
name.sol at/after cutoff         -> unsupported
```

Native .sol resolution backed by the SRS registrar will be enabled in a future SDK update.

## 3. Renamed public APIs

This section is the authoritative rename/move index. Update imports and calls using these maps.

### Resolve

| v1                                     | v2                               |
| -------------------------------------- | -------------------------------- |
| `non_blocking::resolve::resolve_owner` | `non_blocking::resolve::resolve` |
| `blocking::resolve::resolve_owner`     | `blocking::resolve::resolve`     |

### Registration

| v1                                             | v2                                           |
| ---------------------------------------------- | -------------------------------------------- |
| `non_blocking::register::register_domain_name` | `bindings::register_domain::register_domain` |
| `blocking::register::register_domain_name`     | `bindings::register_domain::register_domain` |
| root `register` module                         | `bindings::register_domain`                  |

### Primary Domain

| v1                                            | v2                                                 |
| --------------------------------------------- | -------------------------------------------------- |
| `favourite_domain`                            | `primary_domain`                                   |
| `FavouriteDomain`                             | `PrimaryDomain`                                    |
| `Tag::FavouriteDomain`                        | `Tag::PrimaryDomain`                               |
| `derive_favourite_domain_key`                 | `derive_primary_domain_key`                        |
| `register_favourite`                          | `set_primary_domain`                               |
| `get_register_favourite_instruction`          | `set_primary_domain_instruction`                   |
| `non_blocking::resolve::get_favourite_domain` | `non_blocking::primary_domain::get_primary_domain` |
| `blocking::resolve::get_favourite_domain`     | `blocking::primary_domain::get_primary_domain`     |

### Records

| v1                                             | v2                                                 |
| ---------------------------------------------- | -------------------------------------------------- |
| `non_blocking::resolve::resolve_record`        | `non_blocking::record_v1::get_record`              |
| `blocking::resolve::resolve_record`            | `blocking::record_v1::get_record`                  |
| `record::record_v2::retrieve_record_v2`        | `non_blocking::record_v2::get_record_v2`           |
| `record::record_v2::retrieve_records_batch_v2` | `non_blocking::record_v2::get_multiple_records_v2` |
| no v1 equivalent                               | `blocking::record_v2::get_record_v2`               |
| no v1 equivalent                               | `blocking::record_v2::get_multiple_records_v2`     |

### Domains and Subdomains

| v1                                         | v2                                                |
| ------------------------------------------ | ------------------------------------------------- |
| `non_blocking::resolve::get_domains_owner` | `non_blocking::domain::get_sns_domains_for_owner` |
| `blocking::resolve::get_domains_owner`     | `blocking::domain::get_sns_domains_for_owner`     |
| `non_blocking::resolve::get_subdomains`    | `non_blocking::subdomain::get_subdomains`         |
| `blocking::resolve::get_subdomains`        | `blocking::subdomain::get_subdomains`             |

### Tokenized Domains / NFTs

| v1                                             | v2                                          |
| ---------------------------------------------- | ------------------------------------------- |
| `non_blocking::resolve::get_tokenized_domains` | `non_blocking::nft::get_sns_nfts_for_owner` |
| `non_blocking::resolve::get_record_from_mint`  | `non_blocking::nft::get_record_from_mint`   |
| `non_blocking::resolve::get_nft_records`       | `non_blocking::nft::get_nft_records`        |
| `non_blocking::resolve::resolve_nft_owner`     | `non_blocking::nft::resolve_nft_owner`      |
| no v1 equivalent                               | `blocking::nft::get_record_from_mint`       |
| no v1 equivalent                               | `blocking::nft::get_nft_records`            |
| no v1 equivalent                               | `blocking::nft::get_sns_nfts_for_owner`     |

## 4. Blocking and non-blocking modules

The Rust SDK keeps mutually exclusive blocking and non-blocking modes. RPC-backed APIs moved into feature-specific modules, so imports must change:

```text
non_blocking::resolve            blocking::resolve
non_blocking::record_v1          blocking::record_v1
non_blocking::record_v2          blocking::record_v2
non_blocking::domain             blocking::domain
non_blocking::nft                blocking::nft
non_blocking::primary_domain     blocking::primary_domain
non_blocking::subdomain          blocking::subdomain
```

- default build: exposes `non_blocking`
- `--features blocking`: exposes `blocking`

Shared modules such as `record`, `derivation`, `tld`, `primary_domain`, and `bindings` contain pure parsing, key derivation, constants, or instruction builders.

## 5. Resolve migration

`resolve` replaces `resolve_owner`, takes a full domain with a `.sns` or `.sol` TLD suffix, and returns the owner directly:

- the return changes from `Result<Option<Pubkey>, SnsError>` to `Result<Pubkey, SnsError>`, so remove any `Ok(None)` handling;
- `resolve` takes a required `AllowPda` argument to control whether a program-derived address may be returned.

```rust
use sns_sdk::non_blocking::resolve::{resolve, AllowPda};

let owner = resolve(&client, "mydomain.sns", AllowPda::Deny).await?;
```

## 6. Record migration

### V1 and V2 record fetching

- `resolve_record` moved to `record_v1::get_record`.
- `retrieve_record_v2` / `retrieve_records_batch_v2` moved to `record_v2::get_record_v2` / `get_multiple_records_v2`.
- V2 getters now borrow the client (`&RpcClient`) instead of taking it by value.
- V2 argument order is now `(client, domain, record[s])`.
- All getters require a full domain.

```rust
let record = sns_sdk::non_blocking::record_v1::get_record(
    &client,
    "mydomain.sns",
    Record::Url,
)
.await?;

let record = sns_sdk::non_blocking::record_v2::get_record_v2(
    &client,
    "mydomain.sns",
    Record::Url,
)
.await?;

let records = sns_sdk::non_blocking::record_v2::get_multiple_records_v2(
    &client,
    "mydomain.sns",
    &[Record::Url, Record::Github],
)
.await?;
```

These getters return `Option<(NameRecordHeader, Vec<u8>)>`. The `Vec<u8>` is the record payload with the SPL name account header already stripped, so it can be passed directly to the V2 decoder.

```rust
if let Some((_name_header, data)) = record {
    let fields = sns_sdk::record::record_v2::decode_record_v2_fields(&data)?;
    let parsed = fields.parse_content(Record::Url)?;
}
```

### Removed standalone SOL-record resolvers

- `non_blocking::resolve::resolve_sol_record_v1`
- `non_blocking::resolve::resolve_sol_record_v2`

There is no behavior-identical single-call replacement. Fetch the record with the V1/V2 record getters above, then decode, parse, and validate it with the V2 APIs below.

### V2 parser and type migration

| v1                              | v2                                                     |
| ------------------------------- | ------------------------------------------------------ |
| `parse_raw_record_v2`           | `decode_record_v2_fields`                              |
| `parse_record_v2(record, data)` | `decode_record_v2_fields(data)?.parse_content(record)` |
| `RawRecordV2`                   | `RecordV2Fields`                                       |
| `ParsedRecord`                  | `ParsedRecordV2`                                       |
| `RawRecordV2::content`          | `RecordV2Fields::content_bytes`                        |
| `ParsedRecord::kind`            | `ParsedRecordV2::record`                               |

Also note:

- `ParsedRecordV2` adds `staleness_validation` and `roa_validation` fields, so exhaustive struct patterns and struct literals must be updated;
- `ParsedRecordV2::verify_staleness` expects the effective domain owner, such as `nft_owner.unwrap_or(domain_registry.owner)`;
- the optional owner account data argument to `verify_staleness` is only needed for XChain-owned domains.

## 7. Domain registration migration

Registration changed from mode-specific RPC helpers to a single synchronous instruction builder:

- one shared builder (`bindings::register_domain::register_domain`) replaces the blocking and non-blocking `register_domain_name` helpers;
- there is no RPC client argument;
- the input is a canonical top-level `.sns` domain;
- it returns `Vec<Instruction>` instead of an unsigned `Transaction`, so the application constructs, signs, and submits the transaction.

| v1                                             | v2                                           |
| ---------------------------------------------- | -------------------------------------------- |
| `non_blocking::register::register_domain_name` | `bindings::register_domain::register_domain` |
| `blocking::register::register_domain_name`     | `bindings::register_domain::register_domain` |
| root `register` module                         | `bindings::register_domain`                  |

```rust
let instructions = sns_sdk::bindings::register_domain::register_domain(
    "mydomain.sns",
    space,
    &buyer,
    &buyer_token_account,
    None,
    None,
)?;
```

## 8. Tokenized domain migration

- `get_tokenized_domains` was renamed to `get_sns_nfts_for_owner` and moved from `resolve` to `nft`.
- The return type changes from `Vec<(String, Pubkey)>` to `Vec<SnsNftDomain>`, so tuple destructuring becomes field access on `.reverse`, `.key`, and `.mint`.
- `SnsNftDomain` is shared by blocking and non-blocking builds under `sns_sdk::nft`.

```rust
// v1
let domains = get_tokenized_domains(&client, &owner).await?;
for (reverse, key) in domains {
    // ...
}

// v2
let domains = get_sns_nfts_for_owner(&client, &owner).await?;
for SnsNftDomain { reverse, key, mint } in domains {
    // ...
}
```

## 9. Primary domain migration

The favourite-domain API was renamed to primary domain across terminology, types, and module paths:

- `favourite_domain` → `primary_domain`
- `FavouriteDomain` → `PrimaryDomain`
- `Tag::FavouriteDomain` → `Tag::PrimaryDomain`
- `derive_favourite_domain_key` → `derive_primary_domain_key`
- `register_favourite` → `set_primary_domain`
- `get_register_favourite_instruction` → `set_primary_domain_instruction`
- `get_favourite_domain` → `get_primary_domain`

```rust
let primary = get_primary_domain(&client, &owner)?;
```

## 10. Removed APIs

- `record::convert_u5_array` and `record::record_v1::convert_u5_array` were removed without a public replacement. Use a standard Bech32 conversion if direct conversion is still needed.
- `non_blocking::resolve::deserialize_name_registry` was removed. Use `resolve_name_registry` or `resolve_name_registry_batch` to fetch and deserialize name registry accounts.
- `non_blocking::resolve::deserialize_reverse` was removed. Use `resolve_reverse` or `resolve_reverse_batch` to fetch and deserialize reverse records.

The removed `resolve_sol_record_v1` and `resolve_sol_record_v2` helpers are covered in section 6 because their migration requires the record fetch, decode, and validation flow.
