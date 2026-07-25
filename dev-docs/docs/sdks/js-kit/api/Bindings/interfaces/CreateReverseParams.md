---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / CreateReverseParams

# Interface: CreateReverseParams

Defined in: [bindings/createReverse.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/createReverse.ts#L22)

Parameters for creating a reverse lookup record.

## Example

```ts
const params: CreateReverseParams = { domainAddress, domain: "example", payer };
```

## Properties

### domain

> **domain**: `string`

Defined in: [bindings/createReverse.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/createReverse.ts#L26)

Raw reverse lookup payload.

***

### domainAddress

> **domainAddress**: `Address`

Defined in: [bindings/createReverse.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/createReverse.ts#L24)

Domain account address.

***

### parentAddress?

> `optional` **parentAddress?**: `Address`

Defined in: [bindings/createReverse.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/createReverse.ts#L30)

Parent domain address for a subdomain.

***

### parentOwner?

> `optional` **parentOwner?**: `Address`

Defined in: [bindings/createReverse.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/createReverse.ts#L32)

Parent domain owner for a subdomain.

***

### payer

> **payer**: `Address`

Defined in: [bindings/createReverse.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/createReverse.ts#L28)

Account funding creation.
