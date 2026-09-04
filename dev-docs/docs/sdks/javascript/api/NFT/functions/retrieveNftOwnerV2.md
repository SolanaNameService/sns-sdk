---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [NFT](../index.md) / retrieveNftOwnerV2

# Function: retrieveNftOwnerV2()

> **retrieveNftOwnerV2**(`connection`, `nameAccount`): `Promise`\<`PublicKey` \| `null`\>

Defined in: [nft/retrieveNftOwnerV2.ts:20](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/nft/retrieveNftOwnerV2.ts#L20)

Retrieves the owner of a tokenized name using the mint's largest token account.

Returns `null` when the mint or a one-token holder cannot be found.

## Parameters

### connection

`Connection`

Solana RPC connection used to query token accounts.

### nameAccount

`PublicKey`

Tokenized SNS name account address.

## Returns

`Promise`\<`PublicKey` \| `null`\>

The owner public key, or `null` when no one-token holder exists.

## Example

```ts
const owner = await retrieveNftOwnerV2(connection, nameAccount);
```
