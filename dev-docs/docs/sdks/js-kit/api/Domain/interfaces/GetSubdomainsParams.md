---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetSubdomainsParams

# Interface: GetSubdomainsParams

Defined in: [domain/getSubdomains.ts:29](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSubdomains.ts#L29)

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

Defined in: [domain/getSubdomains.ts:33](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSubdomains.ts#L33)

Full `.sns` parent domain name.

***

### rpc

> **rpc**: `Rpc`\<`GetProgramAccountsApi`\>

Defined in: [domain/getSubdomains.ts:31](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSubdomains.ts#L31)

RPC client.
