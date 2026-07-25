---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / BurnDomainParams

# Interface: BurnDomainParams

Defined in: [bindings/burnDomain.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/burnDomain.ts#L27)

Parameters for burning an SNS domain.

## Example

```ts
const params: BurnDomainParams = {
  domain: "example.sns",
  owner,
  refundAddress,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [bindings/burnDomain.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/burnDomain.ts#L29)

Full `.sns` domain name.

***

### owner

> **owner**: `Address`

Defined in: [bindings/burnDomain.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/burnDomain.ts#L31)

Current domain owner.

***

### refundAddress

> **refundAddress**: `Address`

Defined in: [bindings/burnDomain.ts:33](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/burnDomain.ts#L33)

Account receiving reclaimed rent.
