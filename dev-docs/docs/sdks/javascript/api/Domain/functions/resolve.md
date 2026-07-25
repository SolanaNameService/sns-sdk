---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / resolve

# Function: resolve()

> **resolve**(`connection`, `domain`, `config?`): `Promise`\<`PublicKey`\>

Defined in: [resolve/index.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/resolve/index.ts#L39)

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
