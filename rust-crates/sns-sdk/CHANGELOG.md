# Rust SDK v2.0.0

This is a breaking release of `sns-sdk`.

Use this changelog as a migration guide from v1 to v2. The main migration work is:

- pass explicit TLD suffixes to read and key-derivation APIs
- use canonical `.sns` domains for write APIs
- update renamed primary-domain APIs
- update renamed resolve and record RPC helpers
- update registration to the current CreateSplitV2 / Pyth pull-feed instruction flow
- update imports for the new blocking / non-blocking module layout

## 1. Domain suffix handling

v2 standardizes domain inputs across the Rust SDK. APIs that work with domains no longer accept ambiguous bare names like `mydomain`, unless they are low-level raw name-account APIs.

### Read APIs

Read and key-derivation APIs now require a full domain name with a supported suffix.

Use:

```rust
"mydomain.sns";
"sub.mydomain.sns";
"mydomain.sol";
"sub.mydomain.sol";
```

Do not use:

```rust
"mydomain";
"sub.mydomain";
```

Bare names now return `SnsError::UnsupportedTld`.

Read APIs accept both `.sns` and `.sol`. In v2, `.sol` is an alias for the `.sns` derivation and resolution path for compatibility. There is no separate `.sol` implementation in this release.

This applies to read and key-derivation APIs such as:

- `derivation::get_domain_key`
- `derivation::get_domain_key_with_parent`
- `derivation::get_reverse_key`
- `record::get_record_key`
- `record::get_record_v1_key`
- `record::get_record_v2_key`
- `non_blocking::resolve::resolve`
- `blocking::resolve::resolve`
- `non_blocking::record_v1::get_record`
- `blocking::record_v1::get_record`
- `non_blocking::record_v2::get_record_v2`
- `blocking::record_v2::get_record_v2`

Example:

```rust
use sns_sdk::non_blocking::resolve::{resolve, AllowPda};

let owner = resolve(&client, "mydomain.sns", AllowPda::Deny).await?;
let owner = resolve(&client, "mydomain.sol", AllowPda::Deny).await?;

let key = sns_sdk::derivation::get_domain_key("sub.mydomain.sns")?;
let key = sns_sdk::derivation::get_domain_key("sub.mydomain.sol")?;
```

### Write APIs

Write APIs support canonical `.sns` domains only.

Use canonical lowercase `.sns` names:

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

This applies to write APIs such as:

- `bindings::register_domain::register_domain`
- `bindings::record_v2::create_record_v2_instruction`
- `bindings::record_v2::update_record_v2_instruction`
- `bindings::record_v2::delete_record_v2`
- `bindings::record_v2::write_roa_record_v2`
- `bindings::record_v2::validate_record_v2_content`
- `bindings::record_v2::eth_validate_record_v2_content`

Top-level registration rejects subdomains such as `sub.mydomain.sns`. V2 record writes allow subdomains but still require `.sns`.

### Raw name-account APIs

Low-level name-account APIs still use raw account inputs, not full domain strings.

These APIs expect raw names or account keys:

- `bindings::name_registry::create_name_registry`
- `bindings::name_registry::update_name_registry_data`
- `bindings::name_registry::transfer_name_ownership`
- `bindings::name_registry::delete_name_registry`
- `primary_domain::set_primary_domain_instruction`

For example, use `"mydomain"` rather than `"mydomain.sns"` when directly creating or updating a raw name account.

## 2. Renamed public APIs

Update imports and function calls using these maps.

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

## 3. Blocking and non-blocking modules

The Rust SDK keeps mutually exclusive blocking and non-blocking modes.

- default build: exposes `non_blocking`
- `--features blocking`: exposes `blocking`

RPC-backed APIs now live in feature-specific modules:

```text
non_blocking::resolve
non_blocking::record_v1
non_blocking::record_v2
non_blocking::domain
non_blocking::nft
non_blocking::primary_domain
non_blocking::subdomain

blocking::resolve
blocking::record_v1
blocking::record_v2
blocking::domain
blocking::nft
blocking::primary_domain
blocking::subdomain
```

Shared modules such as `record`, `record::record_v1`, `record::record_v2`, `derivation`, `tld`, `primary_domain`, and `bindings` contain pure parsing, key derivation, constants, or instruction builders.

## 4. Resolve migration

`resolve` replaces `resolve_owner`.

```rust
use sns_sdk::non_blocking::resolve::{resolve, AllowPda};

let owner = resolve(&client, "mydomain.sns", AllowPda::Deny).await?;
```

For blocking builds:

```rust
use sns_sdk::blocking::resolve::{resolve, AllowPda};

let owner = resolve(&client, "mydomain.sns", AllowPda::Deny)?;
```

Resolve behavior follows SNS-IP-5 in both modes.

## 5. Record migration

V1 record fetching now belongs to blocking/non-blocking `record_v1` modules:

```rust
let record = sns_sdk::non_blocking::record_v1::get_record(
    &client,
    "mydomain.sns",
    Record::Url,
)
.await?;
```

V2 record fetching moved into blocking/non-blocking `record_v2` modules:

```rust
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

These getters return raw name registry data:

```rust
Option<(NameRecordHeader, Vec<u8>)>
```

The returned `Vec<u8>` is the stripped record payload after the SPL name account header.

The V2 parser API was clarified:

```rust
let fields = sns_sdk::record::record_v2::decode_record_v2_fields(&data)?;
let parsed = fields.parse_content(Record::Sol)?;
```

`ParsedRecordV2::verify_staleness` returns `Ok(())` when the record's staleness verifier matches the effective domain owner. Pass the effective domain owner, such as `nft_owner.unwrap_or(domain_registry.owner)`. The optional owner account data argument is only needed for XChain-owned domains.

## 6. Domain registration migration

`register_domain` now requires a canonical top-level `.sns` domain and strips the `.sns` suffix before deriving accounts and filling instruction params.

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

## 7. Tokenized domain migration

`get_tokenized_domains` was renamed and moved:

```rust
let domains = sns_sdk::non_blocking::nft::get_sns_nfts_for_owner(&client, &owner).await?;
```

The returned type is now a struct shared by blocking and non-blocking builds:

```rust
pub struct SnsNftDomain {
    pub reverse: String,
    pub key: Pubkey,
    pub mint: Pubkey,
}
```

## 8. Primary domain migration

The Rust SDK renamed the favourite/favorite domain API to primary domain.

```rust
let primary = sns_sdk::non_blocking::primary_domain::get_primary_domain(&client, &owner).await?;
```
