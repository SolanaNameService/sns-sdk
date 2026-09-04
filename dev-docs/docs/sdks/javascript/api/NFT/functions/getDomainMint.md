---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / getDomainMint

# Function: getDomainMint()

> **getDomainMint**(`domain`): `PublicKey`

Defined in: [nft/getDomainMint.ts:15](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/nft/getDomainMint.ts#L15)

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
