---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / getAllSnsDomains

# Function: getAllSnsDomains()

> **getAllSnsDomains**(`connection`): `Promise`\<`GetProgramAccountsResponse`\>

Defined in: [utils/getAllSnsDomains.ts:17](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/utils/getAllSnsDomains.ts#L17)

Retrieves all registered top-level `.sns` domain accounts.

The account data is sliced to avoid enormous payloads and only the owner is returned.

## Parameters

### connection

`Connection`

Solana RPC connection

## Returns

`Promise`\<`GetProgramAccountsResponse`\>

Registered domain accounts with sliced account data.

## Example

```ts
const domains = await getAllSnsDomains(connection);
```
