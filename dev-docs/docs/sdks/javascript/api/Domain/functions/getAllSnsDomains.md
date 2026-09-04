---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / getAllSnsDomains

# Function: getAllSnsDomains()

> **getAllSnsDomains**(`connection`): `Promise`\<`GetProgramAccountsResponse`\>

Defined in: [utils/getAllSnsDomains.ts:18](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getAllSnsDomains.ts#L18)

Retrieves all registered top-level `.sns` domain accounts.

Each returned account's data contains only the 32-byte owner public key.

## Parameters

### connection

`Connection`

Solana RPC connection

## Returns

`Promise`\<`GetProgramAccountsResponse`\>

Registered domain accounts with account data containing only the
owner public key.

## Example

```ts
const domains = await getAllSnsDomains(connection);
```
