# SNS CLI v3.0.0

This is a breaking release of `sns-cli`.

Use this changelog as a migration guide from v2.1.0 to v3.0.0.

## Table of contents

1. [Canonical `.sns` domain inputs](#1-canonical-sns-domain-inputs)
2. [Resolution behavior](#2-resolution-behavior)
3. [Primary-domain command migration](#3-primary-domain-command-migration)
4. [Record command migration](#4-record-command-migration)
5. [Sub-registrar command migration](#5-sub-registrar-command-migration)

## 1. Canonical `.sns` domain inputs

Domain-taking commands now require a complete, canonical `.sns` domain. Bare
names and `.sol` names are no longer accepted.

Use:

```text
mydomain.sns
sub.mydomain.sns
```

Do not use:

```text
mydomain
mydomain.sol
MyDomain.sns
" mydomain.sns"
"mydomain.sns "
too.deep.mydomain.sns
```

Inputs must be lowercase and free of surrounding whitespace. Commands accept
a top-level domain or one subdomain level when the underlying operation
supports subdomains.

This applies to:

- `resolve`
- `register`
- `primary-domain set` (top-level `.sns` domains only)
- `transfer`
- `burn`
- `lookup`
- `record-v2 get`
- `record-v2 set`
- `sub-registrar get`

Before:

```bash
sns resolve mydomain
sns transfer owner.json <NEW_OWNER_PUBKEY> mydomain.sol
```

After:

```bash
sns resolve mydomain.sns
sns transfer owner.json <NEW_OWNER_PUBKEY> mydomain.sns
```

Reverse lookups and owner-domain listings now display discovered names with a
`.sns` suffix instead of adding or retaining `.sol`.

For registration, pass a top-level `.sns` domain:

```bash
sns register buyer.json 1000 mydomain.sns
```

**Action required:** Add the `.sns` suffix to existing bare-domain invocations,
replace `.sol` inputs with the corresponding `.sns` domain, and update output
consumers to expect displayed names with a `.sns` suffix.

## 2. Resolution behavior

`resolve` now follows SNS-IP-5 domain resolution. It checks active tokenized domain ownership, V2 and V1 SOL record values, and then registry ownership. V2 SOL
record ownership was not part of the v2.1.0 CLI resolution path, so the resolved owner can change for affected domains.

**Action required:** Use `resolve` when you need the address a domain resolves to. Use `lookup` to inspect the owner of the domain; it may differ from the address returned by `resolve`.

## 3. Primary-domain command migration

`register-favourite` was replaced by `set-primary-domain`:

```text
v2.1.0: sns register-favourite <OWNER_KEYPAIR_OR_PUBKEY> <DOMAIN>
v3.0.0: sns set-primary-domain <OWNER_KEYPAIR> <DOMAIN.sns>
```

The v2.1.0 command accepted either a keypair path or an owner public key. When
given only a public key, it printed a base58-encoded unsigned transaction for
external signing.

The v3.0.0 command requires the owner's keypair file, signs the transaction,
submits it to the selected RPC endpoint, and prints the transaction signature.

There is no v3 CLI replacement for the public-key-only unsigned-transaction
workflow. Applications that require offline or external signing must construct
the transaction outside this CLI.

The top-level `set-primary-domain` command is now grouped under `primary-domain`:

```text
Before: sns set-primary-domain <OWNER_KEYPAIR> <DOMAIN.sns>
After:  sns primary-domain set <OWNER_KEYPAIR> <DOMAIN.sns>
```

The old top-level command is removed without an alias. `primary-domain set`
accepts only canonical top-level `.sns` domains and preflights that the signer
is the raw owner of the selected registry. Tokenized/NFT ownership does not
substitute for raw registry ownership.

The new read-only command reports a wallet's configured primary domain:

```bash
sns primary-domain get <OWNER_PUBKEY>
```

It reports the requested owner, readable domain, selected name account, and
whether the selection is stale against NFT ownership or, for a non-tokenized
domain, raw registry ownership. A wallet with no configured selection returns
`No primary domain set` successfully; malformed selected state remains an
error.

Use:

```bash
sns primary-domain set owner.json mydomain.sns
```

**Action required:** Use `primary-domain set`, pass a canonical top-level `.sns`
domain, and provide the raw registry owner's keypair. Move public-key-only
unsigned-transaction workflows outside this CLI.

## 4. Record command migration

The legacy `record` command family was removed. The `record-v2` group handles
V2 records only: `get` reads and validates a record, and `set` creates or
updates one.

Update the former V2 read form:

```bash
sns record --v2 get --domain mydomain --record url
```

to:

```bash
sns record-v2 get --domain mydomain.sns --record url
```

The former default `sns record get` command read V1 records. v3 provides no
CLI replacement for reading V1 records; use an SDK or another purpose-built
tool for existing V1-record workflows.

`record-v2 get` fetches and parses a V2 record. Its output includes:

- `Domain`
- `Record`
- `Content`
- `Staleness Verified`
- `RoA Verified`

`RoA Verified` is `N/A` for record types without a Right of Association
validation policy. A missing record or missing domain now returns an error
instead of printing an empty table.

Use the new V2 setter with named options:

```bash
sns record-v2 set --keypair owner.json --domain mydomain.sns --record url --content https://example.com
```

The v2.1.0 `sns record set` command wrote legacy V1 records. Its V2 set branch
(`sns record --v2 set`) was unimplemented. The v3 setter writes only V2 accounts and
does not migrate or overwrite V1 records. It checks whether the V2 account
exists, then submits one SDK create or update instruction; it does not use the
old V1 delete-and-recreate resize flow.

Updates that would clear existing or unreadable validation metadata stop before
transaction submission. Pass `--force` to acknowledge the loss and continue.

The following command remains removed without a CLI replacement:

- `record system-dump`

**Action required:** Rename V2 reads to `record-v2 get`, use `record-v2 set`
for new V2 writes, and pass canonical `.sns` domains. V1 records have been
deprecated and should no longer be used.

## 5. Sub-registrar command migration

During unreleased v3 development, the sub-registrar inspection command was
finalized as a nested command group:

```text
sns get-sub-registrar-info <DOMAIN>
```

becomes:

```text
sns sub-registrar get <DOMAIN.sns>
```

The old top-level spelling is no longer accepted. The command retains its
diagnostic Rust debug output, which is not a stable machine-readable schema.

**Action required:** Update scripts to use `sub-registrar get` and canonical
`.sns` domains.
