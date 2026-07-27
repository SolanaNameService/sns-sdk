---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / reverseLookupBatch

# Function: reverseLookupBatch()

> **reverseLookupBatch**(`connection`, `nameAccounts`): `Promise`\<(`string` \| `undefined`)[]\>

Defined in: [utils/reverseLookupBatch.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/utils/reverseLookupBatch.ts#L21)

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
