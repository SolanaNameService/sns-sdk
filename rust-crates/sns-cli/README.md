<p align="center">
  <img width="200" src="https://www.sns.id/assets/logo/brand.svg" alt="SNS logo" />
</p>

# SNS CLI

Command-line utility for reading and administering Solana Name Service (SNS) `.sns` domains.

[![Crates.io](https://img.shields.io/crates/v/sns-cli.svg)](https://crates.io/crates/sns-cli)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)

The `sns-cli` package installs the `sns` executable. It uses mainnet SNS program constants and defaults to the public mainnet RPC endpoint, so it is intended for mainnet data and transactions.

## Installation

Install the published crate:

```bash
cargo install sns-cli
```

Build this checkout from the repository root:

```bash
cargo build --manifest-path rust-crates/Cargo.toml -p sns-cli --release
```

Install this checkout:

```bash
cargo install --path rust-crates/sns-cli
```

Inspect the available commands and a command's options:

```bash
sns --help
sns resolve --help
```

## Runtime Model

The CLI needs network access to a Solana JSON-RPC endpoint. It selects the endpoint in this order: the command-local `-u <URL>` or `--url <URL>` option, the `RPC_URL` environment variable, then the public mainnet endpoint. The CLI does not read Solana CLI configuration.

Changing `--url` changes only the RPC transport. It does not change the mainnet program IDs, payment path, or explorer links compiled into this executable. A local keypair JSON file is required only for commands that sign and submit writes. Public-key inputs are base58-encoded Solana public keys.

## Domain Rules

All domain arguments are canonical, lowercase, suffixed `.sns` names, such as `mydomain.sns` or the one-level subdomain `team.mydomain.sns`. Bare names, `.sol` names, uppercase names, whitespace, empty labels, and names deeper than one subdomain are rejected.

`register` accepts top-level names only and further limits the label to lowercase letters, digits, hyphens, and underscores. The other domain commands accept a top-level name or one-level subdomain when their underlying operation supports it. This CLI has no `.sol` compatibility or write path.

## Read-Only Quick Start

### Resolve A Domain

Resolve an owner using the selected RPC endpoint:

```bash
sns resolve mydomain.sns
```

### List Domains For An Owner

List directly owned top-level registry domains for a wallet address:

```bash
sns domains <OWNER_PUBKEY>
```

## Command Summary

| Command                    | Purpose                                        | Transaction behavior |
| -------------------------- | ---------------------------------------------- | -------------------- |
| `resolve`                  | Resolve a domain's effective owner             | Read only            |
| `register`                 | Register top-level domains                     | Signs and submits    |
| `set-primary-domain`       | Set an owner's primary domain                  | Signs and submits    |
| `transfer`                 | Transfer domains to another public key         | Signs and submits    |
| `burn`                     | Delete domain registry accounts                | Signs and submits    |
| `lookup`                   | Inspect raw name-registry accounts             | Read only            |
| `reverse-lookup`           | Find the reverse name for an account key       | Read only            |
| `domains`                  | List directly owned top-level registry domains | Read only            |
| `record-v2 get`            | Fetch and validate a V2 record                 | Read only            |
| `get-sub-registrar-info`   | Print sub-registrar information                | Read only            |
| `count registered-domains` | Count root SNS registry accounts               | Read only            |
| `count sub-domains`        | Count subdomains and optionally rank parents   | Read only            |

## Command Reference

Options in brackets are optional. `<DOMAIN>...` and similar ellipses mean one or more positional values. For nested commands, `--url` belongs to the parent group and must appear before the nested command: `sns record-v2 --url <URL> get ...` and `sns count --url <URL> registered-domains`.

### `resolve`

**`resolve`** — resolve a domain's effective owner.

```text
sns resolve [--url <URL>] <DOMAIN>...
```

Arguments: one or more canonical `.sns` domain names. `--url` selects the RPC endpoint.

Output: a progress display followed by a table with `Domain`, resolved `Owner`, and a mainnet-oriented Solana Explorer address link. A missing domain is shown as `Domain not found`.

```bash
sns resolve mydomain.sns
```

### `register`

**`register`** — register top-level domains.

```text
sns register [--url <URL>] <KEYPAIR_PATH> <SPACE> <DOMAIN>...
```

Arguments: a signing keypair JSON path, allocation `SPACE` as an unsigned integer that fits in `u32`, and one or more eligible top-level `.sns` domains. The CLI does not enforce the 1-10 KiB range stated in its generated help; the registration program determines whether the requested allocation is accepted. `--url` selects the RPC endpoint.

Output: after each submitted registration, a table row containing `Domain`, transaction signature, and a mainnet-oriented Explorer transaction link.

### `set-primary-domain`

**`set-primary-domain`** — set an owner's primary domain.

```text
sns set-primary-domain [--url <URL>] <OWNER_KEYPAIR> <DOMAIN>
```

Arguments: the owner's signing keypair JSON path and one canonical `.sns` domain. `--url` selects the RPC endpoint.

Output: `Primary domain set, txid: <SIGNATURE>` after submission.

### `transfer`

**`transfer`** — transfer domains to another public key.

```text
sns transfer [--url <URL>] <OWNER_KEYPAIR_PATH> <NEW_OWNER_PUBKEY> <DOMAIN>...
```

Arguments: the current owner's signing keypair JSON path, the recipient's base58 public key, and one or more canonical `.sns` domains. `--url` selects the RPC endpoint.

Output: a table of `Domain`, submitted transaction signature, and a mainnet-oriented Explorer transaction link.

### `burn`

**`burn`** — delete domain registry accounts.

```text
sns burn [--url <URL>] <KEYPAIR_PATH> <DOMAIN>...
```

Arguments: the current owner's signing keypair JSON path and one or more canonical `.sns` domains. `--url` selects the RPC endpoint.

Output: a table of `Domain`, submitted transaction signature, and a mainnet-oriented Explorer transaction link.

### `lookup`

**`lookup`** — inspect raw name-registry accounts.

```text
sns lookup [--url <URL>] <DOMAIN>...
```

Arguments: one or more canonical `.sns` domains. `--url` selects the RPC endpoint.

Output: a table containing `Domain`, derived `Domain key`, `Parent`, raw name-registry `Owner`, and UTF-8-decoded account `Data`. A missing registry account is shown with `N/A` owner and data.

### `reverse-lookup`

**`reverse-lookup`** — find the reverse name for an account key.

```text
sns reverse-lookup [--url <URL>] <PUBLIC_KEY>
```

Arguments: one base58 public key. `--url` selects the RPC endpoint.

Output: a `Public key` and `Reverse` table when a reverse record exists; otherwise `Domain not found - Are you sure it exists?`.

### `domains`

**`domains`** — list directly owned top-level registry domains.

```text
sns domains [--url <URL>] <OWNER_PUBKEY>...
```

Arguments: one or more base58 owner public keys. `--url` selects the RPC endpoint.

Output: a table of reverse-resolved `Domain`, requested `Owner`, and a naming-site link. It reports direct top-level registry ownership, not every tokenized/NFT domain an address may control.

```bash
sns domains 11111111111111111111111111111111
```

### `record-v2 get`

**`record-v2 get`** — fetch and validate a V2 record.

```text
sns record-v2 [--url <URL>] get --domain <DOMAIN> --record <RECORD>
```

Arguments: parent `--url` selects the RPC endpoint; `--domain` is a canonical `.sns` domain and `--record` is a record label.

Output: a table with `Domain`, canonical `Record`, parsed `Content`, `Staleness Verified`, and `RoA Verified`. Missing records and missing domains are errors. `Staleness Verified` is `true` only when the record's staleness validation succeeds against the effective owner and current registry data. `RoA Verified` is `true` or `false` only for records with a right-of-association validation policy; otherwise it is `N/A`.

Accepted canonical record labels are:

```text
IPFS ARWV SOL ETH BTC LTC DOGE email url discord github reddit twitter telegram
pic SHDW POINT BSC INJ backpack A AAAA CNAME TXT BASE bio
```

For convenience, the CLI also recognizes case-insensitive aliases for `EMAIL`, `URL`, `DISCORD`, `GITHUB`, `REDDIT`, `TWITTER`, `TELEGRAM`, `PIC`, `BACKPACK`, `BIO`, and `INJECTIVE` (for `INJ`).

### `get-sub-registrar-info`

**`get-sub-registrar-info`** — print sub-registrar information.

```text
sns get-sub-registrar-info [--url <URL>] <DOMAIN>
```

Arguments: one canonical `.sns` domain. `--url` selects the RPC endpoint.

Output: the retrieved sub-registrar information in Rust debug formatting. This output is diagnostic rather than a stable machine-readable schema.

### `count registered-domains`

**`count registered-domains`** — count root SNS registry accounts.

```text
sns count [--url <URL>] registered-domains
```

Arguments: parent `--url` selects the RPC endpoint; the nested command has no arguments.

Output: one decimal number, the count of root SNS registry accounts.

### `count sub-domains`

**`count sub-domains`** — count subdomains and optionally rank parents.

```text
sns count [--url <URL>] sub-domains [--top-domains <N>]
```

Arguments: parent `--url` selects the RPC endpoint. `--top-domains <N>` optionally requests the top `N` parent account keys ordered by subdomain count.

Output: pretty-printed JSON with `number_of_domains`, `number_of_subdomains`, `number_of_domains_with_subdomains`, and, when requested, `top_domains` as `[parent_account_key, count]` pairs.

## Write Safety

`register`, `transfer`, and `burn` process their domain lists sequentially. They are not atomic: an earlier transaction may succeed before a later item fails. `burn` deletes the name-registry account, is destructive, and has no prompt or dry-run mode.

Registration builds the default mainnet USDC payment path. Treat all keypair paths as sensitive credentials.

## Operational Caveats

- `lookup` displays the raw name-registry owner, which can differ from an effective tokenized-domain owner. `domains` is intentionally a direct registry-ownership query and does not enumerate all tokenized ownership.

- Both `count` commands call `getProgramAccounts`; on public RPCs this can be expensive, slow, or rejected. Progress displays, tables, debug output, and Explorer/naming-site links are presentation conveniences, not stable APIs. Explorer transaction and address links are mainnet-oriented even if `--url` points elsewhere.

- The current `main` function prints handler errors but does not explicitly set a nonzero process exit status. Automation should inspect stderr/output and not rely solely on a zero exit code to mean the operation succeeded.

For SNS integration guidance, see [developer documentation](https://dev.sns.id/), the [repository overview](../../README.md), and the [Rust SDK guide](../sns-sdk/README.md).

## License

This project is available under the [MIT License](../../LICENSE).
