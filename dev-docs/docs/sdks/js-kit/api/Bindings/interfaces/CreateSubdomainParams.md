---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / CreateSubdomainParams

# Interface: CreateSubdomainParams

Defined in: [bindings/createSubdomain.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/createSubdomain.ts#L29)

Parameters for creating an SNS subdomain.

## Example

```ts
const params: CreateSubdomainParams = {
  rpc,
  subdomain: "sub.example.sns",
  owner,
};
```

## Properties

### feePayer?

> `optional` **feePayer?**: `Address`

Defined in: [bindings/createSubdomain.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/createSubdomain.ts#L39)

Account funding creation. Defaults to `owner`.

***

### owner

> **owner**: `Address`

Defined in: [bindings/createSubdomain.ts:35](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/createSubdomain.ts#L35)

New subdomain owner.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetMinimumBalanceForRentExemptionApi`\>

Defined in: [bindings/createSubdomain.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/createSubdomain.ts#L31)

RPC client.

***

### space?

> `optional` **space?**: `number`

Defined in: [bindings/createSubdomain.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/createSubdomain.ts#L37)

Account data size in bytes. Defaults to 2,000.

***

### subdomain

> **subdomain**: `string`

Defined in: [bindings/createSubdomain.ts:33](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/createSubdomain.ts#L33)

Full `.sns` subdomain name.
