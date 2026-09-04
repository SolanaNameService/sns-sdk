---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / retrieveNfts

# Function: retrieveNfts()

> **retrieveNfts**(`connection`): `Promise`\<`PublicKey`[]\>

Defined in: [nft/retrieveNfts.ts:20](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/nft/retrieveNfts.ts#L20)

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
