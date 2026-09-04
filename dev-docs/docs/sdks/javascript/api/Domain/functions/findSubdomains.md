---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / findSubdomains

# Function: findSubdomains()

> **findSubdomains**(`connection`, `parentKey`): `Promise`\<`string`[]\>

Defined in: [utils/findSubdomains.ts:20](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/findSubdomains.ts#L20)

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
