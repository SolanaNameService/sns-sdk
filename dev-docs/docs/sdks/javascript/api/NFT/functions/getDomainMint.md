---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / getDomainMint

# Function: getDomainMint()

> **getDomainMint**(`domain`): `PublicKey`

Defined in: [nft/getDomainMint.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/nft/getDomainMint.ts#L15)

Derives the NFT mint PDA for a tokenized SNS name account.

## Parameters

### domain

`PublicKey`

Tokenized SNS name account address.

## Returns

`PublicKey`

The derived NFT mint address.

## Example

```ts
const mint = getDomainMint(domainAddress);
```
