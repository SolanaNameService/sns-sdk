---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / PrimaryDomainStateParams

# Interface: PrimaryDomainStateParams

Defined in: [states/primaryDomain.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/primaryDomain.ts#L26)

Input for decoding an SNS primary-domain account.

## Example

```ts
const params: PrimaryDomainStateParams = { tag: 0, nameAccount };
```

## Properties

### nameAccount

> **nameAccount**: `Uint8Array`

Defined in: [states/primaryDomain.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/primaryDomain.ts#L30)

Encoded primary domain account address.

***

### tag

> **tag**: `number`

Defined in: [states/primaryDomain.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/primaryDomain.ts#L28)

Account state tag.
