---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / resolve

# Function: resolve()

> **resolve**(`params`): `Promise`\<`Address`\>

Defined in: [domain/resolve.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/resolve.ts#L27)

Resolves a `.sns` or `.sol` domain to its target address.

## Parameters

### params

[`ResolveParams`](../interfaces/ResolveParams.md)

Resolution parameters

## Returns

`Promise`\<`Address`\>

The resolved target address.

## Example

```ts
const address = await resolve({ rpc, domain: "example.sns" });
```
