---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / getDomainMint

# Function: getDomainMint()

> **getDomainMint**(`domain`): `PublicKey`

Defined in: [nft/getDomainMint.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/nft/getDomainMint.ts#L15)

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
