---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / getAllSolDomains

# Function: getAllSolDomains()

> **getAllSolDomains**(`connection`): `Promise`\<`GetProgramAccountsResponse`\>

Defined in: [utils/getAllSolDomains.ts:23](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getAllSolDomains.ts#L23)

Retrieves all registered top-level `.sol` domain accounts, including expired
domains.

## Parameters

### connection

`Connection`

Solana RPC connection

## Returns

`Promise`\<`GetProgramAccountsResponse`\>

Registered domain accounts, including expired records, with account
data containing only the owner public key.

## Example

```ts
const domains = await getAllSolDomains(connection);
```
