---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / resolve

# Function: resolve()

> **resolve**(`params`): `Promise`\<`Address`\>

Defined in: [domain/resolve.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/resolve.ts#L30)

Resolves a `.sns` or `.sol` domain to its target address.

## Parameters

### params

[`ResolveParams`](../interfaces/ResolveParams.md)

Resolution parameters

## Returns

`Promise`\<`Address`\>

The resolved target address.

## See

[safeResolve](safeResolve.md) for `.sol` resolution that verifies the SRS and
corresponding SNS targets match when SRS-backed resolution is enabled.

## Example

```ts
const address = await resolve({ rpc, domain: "example.sns" });
```
