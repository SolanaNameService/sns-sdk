---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainOwnerParams

# Interface: GetDomainOwnerParams

Defined in: [domain/getDomainOwner.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainOwner.ts#L19)

Parameters for retrieving a domain owner.

## Example

```ts
const params: GetDomainOwnerParams = { rpc, domain: "example.sns" };
```

## Properties

### domain

> **domain**: `string`

Defined in: [domain/getDomainOwner.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainOwner.ts#L23)

Full domain name.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetTokenLargestAccountsApi` & `GetSlotApi`\>

Defined in: [domain/getDomainOwner.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainOwner.ts#L21)

RPC client.
