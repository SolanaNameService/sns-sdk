---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainOwnerParams

# Interface: GetDomainOwnerParams

Defined in: [domain/getDomainOwner.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainOwner.ts#L19)

Parameters for retrieving a domain owner.

## Example

```ts
const params: GetDomainOwnerParams = { rpc, domain: "example.sns" };
```

## Properties

### domain

> **domain**: `string`

Defined in: [domain/getDomainOwner.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainOwner.ts#L23)

Full domain name.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetTokenLargestAccountsApi` & `GetSlotApi`\>

Defined in: [domain/getDomainOwner.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainOwner.ts#L21)

RPC client.
