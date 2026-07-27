---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / safeResolve

# Function: safeResolve()

> **safeResolve**(`connection`, `domain`, `config?`): `Promise`\<`PublicKey`\>

Defined in: [resolve/index.ts:88](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/resolve/index.ts#L88)

Resolves a full `.sns` or `.sol` domain using the same routing as
[resolve](resolve.md).

When SRS-backed `.sol` resolution is enabled, both the `.sol` domain and its
corresponding `.sns` domain must resolve to the same target; otherwise,
[Errors.SnsSolResolutionMismatchError](../../Errors/classes/SnsSolResolutionMismatchError.md) is thrown.

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

The matching SRS and SNS target when compared; otherwise the target returned by [resolve](resolve.md)

## Throws

- [Errors.SnsSolResolutionMismatchError](../../Errors/classes/SnsSolResolutionMismatchError.md) when SRS and SNS resolve a `.sol` domain to different public keys.
- Any resolution error propagated by [resolve](resolve.md), `resolveSol`, or `resolveSns`.

## Example

```ts
const target = await safeResolve(connection, "name.sol");
console.log(target.toBase58());
// => "<BASE58_PUBLIC_KEY>"
```
