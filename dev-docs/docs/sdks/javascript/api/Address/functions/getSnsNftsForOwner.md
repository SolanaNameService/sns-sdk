---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / getSnsNftsForOwner

# Function: getSnsNftsForOwner()

> **getSnsNftsForOwner**(`connection`, `owner`): `Promise`\<[`SnsNft`](../interfaces/SnsNft.md)[]\>

Defined in: [utils/getSnsNftsForOwner.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsNftsForOwner.ts#L38)

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
