---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / GetPythFeedAddressParams

# Interface: GetPythFeedAddressParams

Defined in: [utils/getPythFeedAddress.ts:13](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/utils/getPythFeedAddress.ts#L13)

Parameters for deriving a Pyth feed address.

## Example

```ts
const params: GetPythFeedAddressParams = { shard: 0, priceFeed };
```

## Properties

### priceFeed

> **priceFeed**: `number`[]

Defined in: [utils/getPythFeedAddress.ts:17](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/utils/getPythFeedAddress.ts#L17)

Pyth price feed ID bytes.

***

### shard

> **shard**: `number`

Defined in: [utils/getPythFeedAddress.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/utils/getPythFeedAddress.ts#L15)

Pyth feed shard number.
