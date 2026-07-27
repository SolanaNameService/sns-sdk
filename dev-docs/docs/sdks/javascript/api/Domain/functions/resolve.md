---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / resolve

# Function: resolve()

> **resolve**(`connection`, `domain`, `config?`): `Promise`\<`PublicKey`\>

Defined in: [resolve/index.ts:42](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/resolve/index.ts#L42)

Resolves a full `.sns` or `.sol` domain name to its effective target public key.

`.sns` resolution applies SNS ownership precedence: an active tokenized-domain
owner, then valid V2 and V1 `SOL` records, then the registry owner.

`.sol` currently falls back to SNS-backed resolution until finalized slot
`452_825_395`, then pauses automatically. SRS-backed `.sol` resolution will be
restored in a future SDK update.

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

[safeResolve](safeResolve.md) for `.sol` resolution that verifies the SRS and
corresponding SNS targets match when SRS-backed resolution is enabled.

## Throws

- [Errors.UnsupportedTldError](../../Errors/classes/UnsupportedTldError.md) when the name is bare, has an unsupported suffix, or uses `.sol` after the SDK-managed pause.
- [Errors.DomainDoesNotExist](../../Errors/classes/DomainDoesNotExist.md) when the domain account does not exist.
- [Errors.PdaOwnerNotAllowed](../../Errors/classes/PdaOwnerNotAllowed.md) when the fallback registry owner is a PDA not allowed by `config`.

## Example

```ts
const target = await resolve(connection, "name.sns");
console.log(target.toBase58());
// => "<BASE58_PUBLIC_KEY>"
```
