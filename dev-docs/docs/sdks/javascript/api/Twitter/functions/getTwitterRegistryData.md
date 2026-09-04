---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / getTwitterRegistryData

# Function: getTwitterRegistryData()

> **getTwitterRegistryData**(`connection`, `verifiedPubkey`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: [twitter/getTwitterRegistryData.ts:26](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/twitter/getTwitterRegistryData.ts#L26)

Retrieves raw user-facing registry data for a verified Twitter public key.

This uses an RPC program-account query and does not return the handle; RPC
filtering performance varies by provider.

## Parameters

### connection

`Connection`

Solana RPC connection

### verifiedPubkey

`PublicKey`

Verified public key associated with the handle

## Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Raw name-registry payload bytes

## Throws

When more than one registry matches

## Example

```ts
const data = await getTwitterRegistryData(connection, verifiedPubkey);
```
