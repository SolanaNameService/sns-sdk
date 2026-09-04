---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / getSolNftsForOwner

# Function: getSolNftsForOwner()

> **getSolNftsForOwner**(`connection`, `owner`): `Promise`\<[`SolNft`](../interfaces/SolNft.md)[]\>

Defined in: [utils/getSolNftsForOwner.ts:71](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSolNftsForOwner.ts#L71)

Retrieves tokenized `.sol` domains owned by a wallet, excluding expired
domains.

## Parameters

### connection

`Connection`

Solana RPC connection

### owner

`PublicKey`

Owner of the tokenized domains

## Returns

`Promise`\<[`SolNft`](../interfaces/SolNft.md)[]\>

Tokenized domain records containing the TLD-trimmed domain name, its
SRS record public key, and NFT mint public key

## Example

```ts
const domains = await getSolNftsForOwner(connection, wallet);
```
