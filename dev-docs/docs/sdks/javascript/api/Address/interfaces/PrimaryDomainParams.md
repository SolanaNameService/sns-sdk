---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / PrimaryDomainParams

# Interface: PrimaryDomainParams

Defined in: [primary-domain.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/primary-domain.ts#L29)

Input for decoding a primary-domain account.

## Example

```ts
const params: PrimaryDomainParams = { tag: 0, nameAccount };
```

## Properties

### nameAccount

> **nameAccount**: `Uint8Array`

Defined in: [primary-domain.ts:33](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/primary-domain.ts#L33)

Encoded primary domain account address.

***

### tag

> **tag**: `number`

Defined in: [primary-domain.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/primary-domain.ts#L31)

Account state tag.
