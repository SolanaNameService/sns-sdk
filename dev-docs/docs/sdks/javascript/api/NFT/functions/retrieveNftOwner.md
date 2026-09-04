---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / retrieveNftOwner

# Function: retrieveNftOwner()

> **retrieveNftOwner**(`connection`, `nameAccount`): `Promise`\<`PublicKey` \| `undefined`\>

Defined in: [nft/retrieveNftOwner.ts:21](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/nft/retrieveNftOwner.ts#L21)

Retrieves the owner of a tokenized domain name.

## Parameters

### connection

`Connection`

Solana RPC connection

### nameAccount

`PublicKey`

Domain name account public key

## Returns

`Promise`\<`PublicKey` \| `undefined`\>

Tokenized domain owner, or undefined when none exists.

## Example

```ts
const owner = await retrieveNftOwner(connection, nameAccount);
```
