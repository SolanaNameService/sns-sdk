---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / PrimaryDomainStateParams

# Interface: PrimaryDomainStateParams

Defined in: [states/primaryDomain.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/states/primaryDomain.ts#L26)

Input for decoding an SNS primary-domain account.

## Example

```ts
const params: PrimaryDomainStateParams = { tag: 0, nameAccount };
```

## Properties

### nameAccount

> **nameAccount**: `Uint8Array`

Defined in: [states/primaryDomain.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/states/primaryDomain.ts#L30)

Encoded primary domain account address.

***

### tag

> **tag**: `number`

Defined in: [states/primaryDomain.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/states/primaryDomain.ts#L28)

Account state tag.
