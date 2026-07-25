---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / getPrimaryDomain

# Function: getPrimaryDomain()

> **getPrimaryDomain**(`connection`, `owner`): `Promise`\<\{ `domain`: `PublicKey`; `reverse`: `string`; `stale`: `boolean`; \}\>

Defined in: [primary-domain.ts:122](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/primary-domain.ts#L122)

Retrieves the primary domain set for a wallet.

## Parameters

### connection

`Connection`

Solana RPC connection

### owner

`PublicKey`

The public key of the wallet owner

## Returns

`Promise`\<\{ `domain`: `PublicKey`; `reverse`: `string`; `stale`: `boolean`; \}\>

The primary domain account, reverse domain name, and stale status

## Example

```ts
const primary = await getPrimaryDomain(connection, wallet);
```
