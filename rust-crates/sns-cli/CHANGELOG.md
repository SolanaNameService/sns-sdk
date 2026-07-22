# SNS CLI v3.0.0

This is a breaking release of `sns-cli`.

Use this changelog as a migration guide from v2.1.0 to v3.0.0.

## Table of contents

1. [Canonical `.sns` domain inputs](#1-canonical-sns-domain-inputs)
2. [Resolution behavior](#2-resolution-behavior)
3. [Primary-domain command migration](#3-primary-domain-command-migration)
4. [Record command migration](#4-record-command-migration)

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
- `set-primary-domain`
- `transfer`
- `burn`
- `lookup`
- `record-v2 get`
- `get-sub-registrar-info`

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

Use:

```bash
sns set-primary-domain owner.json mydomain.sns
```

**Action required:** Rename the command, pass a canonical `.sns` domain, and
provide the owner keypair. Move public-key-only unsigned-transaction workflows
outside this CLI.

## 4. Record command migration

The legacy `record` command family was removed. `record-v2 get` is a read-only
command for V2 records only.

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

The following commands were removed without CLI replacements:

- `record set`
- `record system-dump`

**Action required:** Rename V2 reads to `record-v2 get` and pass canonical
`.sns` domains. V1 records have been deprecated and should not longer be used.
