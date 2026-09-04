---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetPrimaryDomainsBatchParams

# Interface: GetPrimaryDomainsBatchParams

Defined in: [address/getPrimaryDomainsBatch.ts:32](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getPrimaryDomainsBatch.ts#L32)

Parameters for retrieving primary domains for multiple wallets.

## Example

```ts
const params: GetPrimaryDomainsBatchParams = { rpc, walletAddresses };
```

## Properties

### rpc

> **rpc**: `Rpc`\<`GetMultipleAccountsApi` & `GetTokenLargestAccountsApi`\>

Defined in: [address/getPrimaryDomainsBatch.ts:34](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getPrimaryDomainsBatch.ts#L34)

RPC client.

***

### walletAddresses

> **walletAddresses**: `Address`[]

Defined in: [address/getPrimaryDomainsBatch.ts:36](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getPrimaryDomainsBatch.ts#L36)

Wallet addresses.
