---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [NFT](../index.md) / GetSnsNftOwnerParams

# Interface: GetSnsNftOwnerParams

Defined in: [nft/getSnsNftOwner.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/nft/getSnsNftOwner.ts#L22)

Parameters for retrieving an SNS NFT owner.

## Example

```ts
const params: GetSnsNftOwnerParams = { rpc, domainAddress };
```

## Properties

### domainAddress

> **domainAddress**: `Address`

Defined in: [nft/getSnsNftOwner.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/nft/getSnsNftOwner.ts#L26)

Tokenized domain account address.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetTokenLargestAccountsApi`\>

Defined in: [nft/getSnsNftOwner.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/nft/getSnsNftOwner.ts#L24)

RPC client.
