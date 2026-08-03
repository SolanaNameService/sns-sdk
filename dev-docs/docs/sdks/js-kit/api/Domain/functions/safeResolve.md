---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / safeResolve

# Function: safeResolve()

> **safeResolve**(`params`): `Promise`\<`Address`\>

Defined in: [domain/resolve.ts:74](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/resolve.ts#L74)

Resolves a `.sns` or `.sol` domain using the same routing as [resolve](resolve.md).

When SRS-backed `.sol` resolution is enabled, both the `.sol` domain and its
corresponding `.sns` domain must resolve to the same target; otherwise,
[Errors.SnsSolResolutionMismatchError](../../Errors/classes/SnsSolResolutionMismatchError.md) is thrown.

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
