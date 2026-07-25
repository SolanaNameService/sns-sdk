---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / retrieveRecords

# Function: retrieveRecords()

> **retrieveRecords**(`connection`, `owner`): `Promise`\<[`NftRecord`](../classes/NftRecord.md)[]\>

Defined in: [nft/retrieveRecords.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/nft/retrieveRecords.ts#L40)

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
