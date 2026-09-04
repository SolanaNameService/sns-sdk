---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [NFT](../index.md) / getSnsNftOwner

# Function: getSnsNftOwner()

> **getSnsNftOwner**(`params`): `Promise`\<`Address` \| `null`\>

Defined in: [nft/getSnsNftOwner.ts:42](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/nft/getSnsNftOwner.ts#L42)

Retrieves the owner of a tokenized SNS domain.

## Parameters

### params

[`GetSnsNftOwnerParams`](../interfaces/GetSnsNftOwnerParams.md)

NFT owner retrieval parameters

## Returns

`Promise`\<`Address` \| `null`\>

The SNS domain NFT owner address, or `null` when no valid tokenized owner is found.

## Example

```ts
const owner = await getSnsNftOwner({ rpc, domainAddress });
```
