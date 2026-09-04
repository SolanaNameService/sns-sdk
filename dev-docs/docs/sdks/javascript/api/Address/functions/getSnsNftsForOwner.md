---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / getSnsNftsForOwner

# Function: getSnsNftsForOwner()

> **getSnsNftsForOwner**(`connection`, `owner`): `Promise`\<[`SnsNft`](../interfaces/SnsNft.md)[]\>

Defined in: [utils/getSnsNftsForOwner.ts:40](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSnsNftsForOwner.ts#L40)

Retrieves tokenized `.sns` domains owned by a wallet.

## Parameters

### connection

`Connection`

Solana RPC connection

### owner

`PublicKey`

Owner of the tokenized domains

## Returns

`Promise`\<[`SnsNft`](../interfaces/SnsNft.md)[]\>

Tokenized domain records containing the domain name, its name
account public key, and NFT mint public key

## Example

```ts
const domains = await getSnsNftsForOwner(connection, wallet);
```
