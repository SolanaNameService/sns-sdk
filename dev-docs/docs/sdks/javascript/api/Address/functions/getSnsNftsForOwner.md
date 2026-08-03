---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / getSnsNftsForOwner

# Function: getSnsNftsForOwner()

> **getSnsNftsForOwner**(`connection`, `owner`): `Promise`\<[`SnsNft`](../interfaces/SnsNft.md)[]\>

Defined in: [utils/getSnsNftsForOwner.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/utils/getSnsNftsForOwner.ts#L38)

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
