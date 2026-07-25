---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / TransferDomainParams

# Interface: TransferDomainParams

Defined in: [bindings/transferDomain.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/transferDomain.ts#L20)

Parameters for transferring an SNS domain.

## Example

```ts
const params: TransferDomainParams = { rpc, domain: "example.sns", newOwner };
```

## Properties

### domain

> **domain**: `string`

Defined in: [bindings/transferDomain.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/transferDomain.ts#L24)

Full `.sns` domain name.

***

### newOwner

> **newOwner**: `Address`

Defined in: [bindings/transferDomain.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/transferDomain.ts#L26)

New domain owner.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi`\>

Defined in: [bindings/transferDomain.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/transferDomain.ts#L22)

RPC client.
