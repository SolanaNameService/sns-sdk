---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / getDomainMint

# Function: getDomainMint()

> **getDomainMint**(`domain`): `PublicKey`

Defined in: [nft/getDomainMint.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/nft/getDomainMint.ts#L15)

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
