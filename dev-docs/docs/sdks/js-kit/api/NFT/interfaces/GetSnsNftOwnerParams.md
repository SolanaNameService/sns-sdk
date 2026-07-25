---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [NFT](../index.md) / GetSnsNftOwnerParams

# Interface: GetSnsNftOwnerParams

Defined in: [nft/getSnsNftOwner.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/nft/getSnsNftOwner.ts#L22)

Parameters for retrieving an SNS NFT owner.

## Example

```ts
const params: GetSnsNftOwnerParams = { rpc, domainAddress };
```

## Properties

### domainAddress

> **domainAddress**: `Address`

Defined in: [nft/getSnsNftOwner.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/nft/getSnsNftOwner.ts#L26)

Tokenized domain account address.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetTokenLargestAccountsApi`\>

Defined in: [nft/getSnsNftOwner.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/nft/getSnsNftOwner.ts#L24)

RPC client.
