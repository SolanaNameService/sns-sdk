---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / resolve

# Function: resolve()

> **resolve**(`params`): `Promise`\<`Address`\>

Defined in: [domain/resolve.ts:27](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/resolve.ts#L27)

Resolves a `.sns` or `.sol` domain to its target address.

## Parameters

### params

[`ResolveParams`](../interfaces/ResolveParams.md)

Resolution parameters

## Returns

`Promise`\<`Address`\>

The resolved target address.

## See

[safeResolve](safeResolve.md) for `.sol` resolution that verifies the SRS and corresponding SNS targets match.

## Example

```ts
const address = await resolve({ rpc, domain: "example.sns" });
```
