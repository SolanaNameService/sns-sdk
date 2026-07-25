---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetPrimaryDomainsBatchParams

# Interface: GetPrimaryDomainsBatchParams

Defined in: [address/getPrimaryDomainsBatch.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/address/getPrimaryDomainsBatch.ts#L32)

Parameters for retrieving primary domains for multiple wallets.

## Example

```ts
const params: GetPrimaryDomainsBatchParams = { rpc, walletAddresses };
```

## Properties

### rpc

> **rpc**: `Rpc`\<`GetMultipleAccountsApi` & `GetTokenLargestAccountsApi`\>

Defined in: [address/getPrimaryDomainsBatch.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/address/getPrimaryDomainsBatch.ts#L34)

RPC client.

***

### walletAddresses

> **walletAddresses**: `Address`[]

Defined in: [address/getPrimaryDomainsBatch.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/address/getPrimaryDomainsBatch.ts#L36)

Wallet addresses.
