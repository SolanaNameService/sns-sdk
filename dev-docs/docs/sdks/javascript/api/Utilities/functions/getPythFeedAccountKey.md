---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getPythFeedAccountKey

# Function: getPythFeedAccountKey()

> **getPythFeedAccountKey**(`shard`, `priceFeed`): \[`PublicKey`, `number`\]

Defined in: [utils/getPythFeedAccountKey.ts:17](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getPythFeedAccountKey.ts#L17)

Derives a Pyth push-oracle price-feed account address from its shard and feed ID.

## Parameters

### shard

`number`

Pyth feed shard identifier

### priceFeed

`number`[]

Price-feed identifier bytes

## Returns

\[`PublicKey`, `number`\]

Derived Pyth feed address and bump seed

## Example

```ts
const [address] = getPythFeedAccountKey(0, priceFeedId);
```
