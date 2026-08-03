---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / retrieveNfts

# Function: retrieveNfts()

> **retrieveNfts**(`connection`): `Promise`\<`PublicKey`[]\>

Defined in: [nft/retrieveNfts.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/nft/retrieveNfts.ts#L20)

Retrieves all tokenized domain name accounts.

## Parameters

### connection

`Connection`

Solana RPC connection

## Returns

`Promise`\<`PublicKey`[]\>

Tokenized domain name account public keys.

## Example

```ts
const domains = await retrieveNfts(connection);
```
