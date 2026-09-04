---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / safeResolve

# Function: safeResolve()

> **safeResolve**(`params`): `Promise`\<`Address`\>

Defined in: [domain/resolve.ts:66](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/resolve.ts#L66)

Resolves a `.sns` or `.sol` domain using the same routing as [resolve](resolve.md).

For `.sol` input, both the SRS domain and its corresponding `.sns` domain
must resolve to the same target; otherwise, [Errors.SnsSolResolutionMismatchError](../../Errors/classes/SnsSolResolutionMismatchError.md) is thrown.

## Parameters

### params

[`ResolveParams`](../interfaces/ResolveParams.md)

Resolution parameters

## Returns

`Promise`\<`Address`\>

The matching SRS and SNS target when compared; otherwise the target returned by [resolve](resolve.md)

## Throws

- [Errors.SnsSolResolutionMismatchError](../../Errors/classes/SnsSolResolutionMismatchError.md) when SRS and SNS resolve a `.sol` domain to different addresses.
- Any resolution error propagated by [resolve](resolve.md), `resolveSol`, or `resolveSns`.

## Example

```ts
const address = await safeResolve({ rpc, domain: "example.sol" });
```
