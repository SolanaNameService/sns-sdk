---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / deleteTwitterRegistry

# Function: deleteTwitterRegistry()

> **deleteTwitterRegistry**(`twitterHandle`, `verifiedPubkey`): `Promise`\<`TransactionInstruction`[]\>

Defined in: [twitter/deleteTwitterRegistry.ts:25](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/twitter/deleteTwitterRegistry.ts#L25)

Builds instructions to delete a verified Twitter handle registry and reverse registry.

The verified public key must sign the resulting instructions.

## Parameters

### twitterHandle

`string`

Verified Twitter handle whose registries are deleted.

### verifiedPubkey

`PublicKey`

Signer that owns both registries and receives their lamports.

## Returns

`Promise`\<`TransactionInstruction`[]\>

Instructions that delete the user-facing and reverse registries.

## Example

```ts
const instructions = await deleteTwitterRegistry("bonfida", owner);
```
