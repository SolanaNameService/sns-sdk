---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / getTwitterRegistryData

# Function: getTwitterRegistryData()

> **getTwitterRegistryData**(`connection`, `verifiedPubkey`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: [twitter/getTwitterRegistryData.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/twitter/getTwitterRegistryData.ts#L26)

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
