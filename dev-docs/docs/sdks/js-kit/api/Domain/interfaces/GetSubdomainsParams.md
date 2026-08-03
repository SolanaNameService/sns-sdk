---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetSubdomainsParams

# Interface: GetSubdomainsParams

Defined in: [domain/getSubdomains.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getSubdomains.ts#L30)

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

Defined in: [domain/getSubdomains.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getSubdomains.ts#L34)

Full parent domain name, including its `.sns` or `.sol` suffix.

***

### rpc

> **rpc**: `Rpc`\<`GetProgramAccountsApi` & `GetSlotApi`\>

Defined in: [domain/getSubdomains.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getSubdomains.ts#L32)

RPC client.
