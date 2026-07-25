---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / getPythFeedAddress

# Function: getPythFeedAddress()

> **getPythFeedAddress**(`params`): `Promise`\<`Address`\<`string`\>\>

Defined in: [utils/getPythFeedAddress.ts:33](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/utils/getPythFeedAddress.ts#L33)

Derives the Pyth feed PDA for a shard and price feed.

## Parameters

### params

[`GetPythFeedAddressParams`](../interfaces/GetPythFeedAddressParams.md)

Pyth feed derivation parameters

## Returns

`Promise`\<`Address`\<`string`\>\>

The Pyth feed address.

## Example

```ts
const address = await getPythFeedAddress({ shard: 0, priceFeed });
```
