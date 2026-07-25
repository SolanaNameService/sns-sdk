---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetPrimaryDomainParams

# Interface: GetPrimaryDomainParams

Defined in: [address/getPrimaryDomain.ts:25](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/address/getPrimaryDomain.ts#L25)

Parameters for retrieving a wallet's primary domain.

## Example

```ts
const params: GetPrimaryDomainParams = { rpc, walletAddress };
```

## Properties

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetTokenLargestAccountsApi`\>

Defined in: [address/getPrimaryDomain.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/address/getPrimaryDomain.ts#L27)

RPC client.

***

### walletAddress

> **walletAddress**: `Address`

Defined in: [address/getPrimaryDomain.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/address/getPrimaryDomain.ts#L29)

Wallet address.
