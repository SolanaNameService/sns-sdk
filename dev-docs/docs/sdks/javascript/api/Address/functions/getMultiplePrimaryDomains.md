---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / getMultiplePrimaryDomains

# Function: getMultiplePrimaryDomains()

> **getMultiplePrimaryDomains**(`connection`, `wallets`): `Promise`\<(`string` \| `undefined`)[]\>

Defined in: [primary-domain.ts:171](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/primary-domain.ts#L171)

Retrieves primary domain names for multiple wallets, up to a maximum of 100.

If a wallet does not have a primary domain, the result is `undefined`.

## Parameters

### connection

`Connection`

Solana RPC connection

### wallets

`PublicKey`[]

Wallet public keys

## Returns

`Promise`\<(`string` \| `undefined`)[]\>

Primary domain names, or undefined for wallets without one.

## Example

```ts
const domains = await getMultiplePrimaryDomains(connection, wallets);
```
