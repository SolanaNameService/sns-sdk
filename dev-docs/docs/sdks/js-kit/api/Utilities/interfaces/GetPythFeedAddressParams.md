---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / GetPythFeedAddressParams

# Interface: GetPythFeedAddressParams

Defined in: [utils/getPythFeedAddress.ts:13](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/getPythFeedAddress.ts#L13)

Parameters for deriving a Pyth feed address.

## Example

```ts
const params: GetPythFeedAddressParams = { shard: 0, priceFeed };
```

## Properties

### priceFeed

> **priceFeed**: `number`[]

Defined in: [utils/getPythFeedAddress.ts:17](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/getPythFeedAddress.ts#L17)

Pyth price feed ID bytes.

***

### shard

> **shard**: `number`

Defined in: [utils/getPythFeedAddress.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/getPythFeedAddress.ts#L15)

Pyth feed shard number.
