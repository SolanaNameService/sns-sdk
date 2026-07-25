---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / BurnDomainParams

# Interface: BurnDomainParams

Defined in: [bindings/burnDomain.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/burnDomain.ts#L27)

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

Defined in: [bindings/burnDomain.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/burnDomain.ts#L29)

Full `.sns` domain name.

***

### owner

> **owner**: `Address`

Defined in: [bindings/burnDomain.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/burnDomain.ts#L31)

Current domain owner.

***

### refundAddress

> **refundAddress**: `Address`

Defined in: [bindings/burnDomain.ts:33](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/burnDomain.ts#L33)

Account receiving reclaimed rent.
