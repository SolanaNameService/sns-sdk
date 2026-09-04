---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / PrimaryDomainParams

# Interface: PrimaryDomainParams

Defined in: [primary-domain.ts:29](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/primary-domain.ts#L29)

Input for decoding a primary-domain account.

## Example

```ts
const params: PrimaryDomainParams = { tag: 0, nameAccount };
```

## Properties

### nameAccount

> **nameAccount**: `Uint8Array`

Defined in: [primary-domain.ts:33](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/primary-domain.ts#L33)

Encoded primary domain account address.

***

### tag

> **tag**: `number`

Defined in: [primary-domain.ts:31](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/primary-domain.ts#L31)

Account state tag.
