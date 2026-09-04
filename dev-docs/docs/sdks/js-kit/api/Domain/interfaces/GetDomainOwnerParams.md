---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainOwnerParams

# Interface: GetDomainOwnerParams

Defined in: [domain/getDomainOwner.ts:18](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainOwner.ts#L18)

Parameters for retrieving a domain owner.

## Example

```ts
const params: GetDomainOwnerParams = { rpc, domain: "example.sns" };
```

## Properties

### domain

> **domain**: `string`

Defined in: [domain/getDomainOwner.ts:22](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainOwner.ts#L22)

Full `.sns` domain name.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetTokenLargestAccountsApi`\>

Defined in: [domain/getDomainOwner.ts:20](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainOwner.ts#L20)

RPC client.
