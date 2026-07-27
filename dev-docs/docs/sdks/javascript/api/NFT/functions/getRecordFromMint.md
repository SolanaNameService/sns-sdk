---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / getRecordFromMint

# Function: getRecordFromMint()

> **getRecordFromMint**(`connection`, `mint`): `Promise`\<`GetProgramAccountsResponse`\>

Defined in: [nft/getRecordFromMint.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/nft/getRecordFromMint.ts#L21)

Retrieves NFT records for a domain mint.

## Parameters

### connection

`Connection`

Solana RPC connection

### mint

`PublicKey`

NFT record mint

## Returns

`Promise`\<`GetProgramAccountsResponse`\>

Matching NFT record program accounts.

## Example

```ts
const records = await getRecordFromMint(connection, mint);
```
