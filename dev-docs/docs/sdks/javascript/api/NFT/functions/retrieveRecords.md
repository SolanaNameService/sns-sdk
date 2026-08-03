---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / retrieveRecords

# Function: retrieveRecords()

> **retrieveRecords**(`connection`, `owner`): `Promise`\<[`NftRecord`](../classes/NftRecord.md)[]\>

Defined in: [nft/retrieveRecords.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/nft/retrieveRecords.ts#L40)

Retrieves active SNS NFT records for tokenized domains owned by a wallet.

## Parameters

### connection

`Connection`

Solana RPC connection used to query token and NFT accounts.

### owner

`PublicKey`

Wallet address that owns the tokenized domains.

## Returns

`Promise`\<[`NftRecord`](../classes/NftRecord.md)[]\>

Active NFT records associated with the wallet's tokenized domains.

## Example

```ts
const records = await retrieveRecords(connection, owner);
```
