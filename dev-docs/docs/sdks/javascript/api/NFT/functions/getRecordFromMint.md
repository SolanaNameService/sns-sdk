---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / getRecordFromMint

# Function: getRecordFromMint()

> **getRecordFromMint**(`connection`, `mint`): `Promise`\<`GetProgramAccountsResponse`\>

Defined in: [nft/getRecordFromMint.ts:21](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/nft/getRecordFromMint.ts#L21)

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
