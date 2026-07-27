---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / findSubdomains

# Function: findSubdomains()

> **findSubdomains**(`connection`, `parentKey`): `Promise`\<`string`[]\>

Defined in: [utils/findSubdomains.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/utils/findSubdomains.ts#L20)

Finds subdomains for a parent domain account.

## Parameters

### connection

`Connection`

Solana RPC connection

### parentKey

`PublicKey`

Parent domain account public key

## Returns

`Promise`\<`string`[]\>

Human-readable subdomain names.

## Example

```ts
const domains = await findSubdomains(connection, parentDomainKey);
```
