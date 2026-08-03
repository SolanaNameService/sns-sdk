---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / getRecordFromMint

# Function: getRecordFromMint()

> **getRecordFromMint**(`connection`, `mint`): `Promise`\<`GetProgramAccountsResponse`\>

Defined in: [nft/getRecordFromMint.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/nft/getRecordFromMint.ts#L21)

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
