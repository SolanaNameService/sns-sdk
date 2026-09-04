---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / reverseLookupBatch

# Function: reverseLookupBatch()

> **reverseLookupBatch**(`connection`, `nameAccounts`): `Promise`\<(`string` \| `undefined`)[]\>

Defined in: [utils/reverseLookupBatch.ts:21](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/reverseLookupBatch.ts#L21)

Performs reverse lookups for domain accounts.

## Parameters

### connection

`Connection`

Solana RPC connection

### nameAccounts

`PublicKey`[]

Domain account public keys to reverse look up

## Returns

`Promise`\<(`string` \| `undefined`)[]\>

Human-readable domain names when reverse accounts exist.

## Example

```ts
const domains = await reverseLookupBatch(connection, nameAccounts);
```
