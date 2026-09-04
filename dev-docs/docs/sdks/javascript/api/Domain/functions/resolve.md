---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / resolve

# Function: resolve()

> **resolve**(`connection`, `domain`, `config?`): `Promise`\<`PublicKey`\>

Defined in: [resolve/index.ts:47](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/resolve/index.ts#L47)

Resolves a full `.sns` or `.sol` domain name to its effective target public key.

`.sns` resolution applies SNS ownership precedence: an active tokenized-domain
owner, then valid V2 and V1 `SOL` records, then the registry owner.

`.sol` resolution reads and validates the canonical SRS record. It resolves
either the record's direct public-key owner or the unique current holder of
its canonical token mint.

## Parameters

### connection

`Connection`

Solana RPC connection

### domain

`string`

Full domain name with a supported `.sns` or `.sol` suffix

### config?

[`ResolveConfig`](../type-aliases/ResolveConfig.md) = `...`

PDA allowance policy. Defaults to `{ allowPda: false }`

## Returns

`Promise`\<`PublicKey`\>

Effective target as a web3.js `PublicKey`

## See

[safeResolve](safeResolve.md) for `.sol` resolution that additionally requires the
SRS target to match the corresponding SNS target.

## Throws

- [Errors.UnsupportedTldError](../../Errors/classes/UnsupportedTldError.md) when the name is bare or has an unsupported suffix.
- [Errors.DomainDoesNotExist](../../Errors/classes/DomainDoesNotExist.md) when the SNS registry or canonical SRS record does not exist.
- [Errors.DomainExpired](../../Errors/classes/DomainExpired.md) when an SRS record has expired.
- [Errors.RecordMalformed](../../Errors/classes/RecordMalformed.md) when the on-chain data required for resolution is malformed or invalid.
- [Errors.CouldNotFindNftOwner](../../Errors/classes/CouldNotFindNftOwner.md) when an active tokenized SNS domain owner cannot be found.
- [Errors.CouldNotFindSrsOwner](../../Errors/classes/CouldNotFindSrsOwner.md) when a tokenized SRS owner cannot be resolved.
- [Errors.WrongValidation](../../Errors/classes/WrongValidation.md) when an SNS V2 `SOL` record uses unsupported validation types.
- [Errors.InvalidRoaError](../../Errors/classes/InvalidRoaError.md) when an SNS V2 `SOL` record fails right-of-association validation.
- [Errors.PdaOwnerNotAllowed](../../Errors/classes/PdaOwnerNotAllowed.md) when the effective owner is a PDA not allowed by `config`.

## Example

```ts
const target = await resolve(connection, "name.sns");
console.log(target.toBase58());
// => "<BASE58_PUBLIC_KEY>"
```
