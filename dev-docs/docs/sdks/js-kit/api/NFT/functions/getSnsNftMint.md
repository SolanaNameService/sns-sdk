---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [NFT](../index.md) / getSnsNftMint

# Function: getSnsNftMint()

> **getSnsNftMint**(`params`): `Promise`\<`Address`\<`string`\>\>

Defined in: [nft/getSnsNftMint.ts:33](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/nft/getSnsNftMint.ts#L33)

Derives the mint address of a tokenized SNS domain.

## Parameters

### params

[`GetSnsNftMintParams`](../interfaces/GetSnsNftMintParams.md)

NFT mint derivation parameters

## Returns

`Promise`\<`Address`\<`string`\>\>

The derived SNS domain NFT mint address.

## Example

```ts
const mint = await getSnsNftMint({ domainAddress });
```
