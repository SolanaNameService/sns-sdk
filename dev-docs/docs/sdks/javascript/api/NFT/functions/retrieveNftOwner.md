---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / retrieveNftOwner

# Function: retrieveNftOwner()

> **retrieveNftOwner**(`connection`, `nameAccount`): `Promise`\<`PublicKey` \| `undefined`\>

Defined in: [nft/retrieveNftOwner.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/nft/retrieveNftOwner.ts#L21)

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
