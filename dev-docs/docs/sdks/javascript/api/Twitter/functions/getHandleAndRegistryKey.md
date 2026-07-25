---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / getHandleAndRegistryKey

# Function: getHandleAndRegistryKey()

> **getHandleAndRegistryKey**(`connection`, `verifiedPubkey`): `Promise`\<\[`string`, `PublicKey`\]\>

Defined in: [twitter/getHandleAndRegistryKey.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/twitter/getHandleAndRegistryKey.ts#L22)

Retrieves a verified public key's Twitter handle and user-facing registry key.

## Parameters

### connection

`Connection`

Solana RPC connection used to retrieve the reverse registry.

### verifiedPubkey

`PublicKey`

Verified public key to look up.

## Returns

`Promise`\<\[`string`, `PublicKey`\]\>

The Twitter handle and its user-facing registry address.

## Example

```ts
const [handle, registry] = await getHandleAndRegistryKey(connection, owner);
```
