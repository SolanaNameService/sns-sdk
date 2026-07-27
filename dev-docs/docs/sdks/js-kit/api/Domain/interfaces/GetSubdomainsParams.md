---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetSubdomainsParams

# Interface: GetSubdomainsParams

Defined in: [domain/getSubdomains.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/domain/getSubdomains.ts#L30)

Parameters for retrieving subdomains under a parent domain.

## Example

```ts
const params: GetSubdomainsParams = {
  rpc,
  domain: "example.sns",
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [domain/getSubdomains.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/domain/getSubdomains.ts#L34)

Full parent domain name, including its `.sns` or `.sol` suffix.

***

### rpc

> **rpc**: `Rpc`\<`GetProgramAccountsApi` & `GetSlotApi`\>

Defined in: [domain/getSubdomains.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/domain/getSubdomains.ts#L32)

RPC client.
