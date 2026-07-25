---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / getHandleAndRegistryKey

# Function: getHandleAndRegistryKey()

> **getHandleAndRegistryKey**(`connection`, `verifiedPubkey`): `Promise`\<\[`string`, `PublicKey`\]\>

Defined in: [twitter/getHandleAndRegistryKey.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/twitter/getHandleAndRegistryKey.ts#L22)

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
