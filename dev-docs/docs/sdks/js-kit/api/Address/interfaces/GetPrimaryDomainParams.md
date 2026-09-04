---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetPrimaryDomainParams

# Interface: GetPrimaryDomainParams

Defined in: [address/getPrimaryDomain.ts:25](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getPrimaryDomain.ts#L25)

Parameters for retrieving a wallet's primary domain.

## Example

```ts
const params: GetPrimaryDomainParams = { rpc, walletAddress };
```

## Properties

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetTokenLargestAccountsApi`\>

Defined in: [address/getPrimaryDomain.ts:27](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getPrimaryDomain.ts#L27)

RPC client.

***

### walletAddress

> **walletAddress**: `Address`

Defined in: [address/getPrimaryDomain.ts:29](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getPrimaryDomain.ts#L29)

Wallet address.
