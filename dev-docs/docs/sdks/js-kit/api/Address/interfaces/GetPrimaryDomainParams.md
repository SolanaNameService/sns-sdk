---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetPrimaryDomainParams

# Interface: GetPrimaryDomainParams

Defined in: [address/getPrimaryDomain.ts:25](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/address/getPrimaryDomain.ts#L25)

Parameters for retrieving a wallet's primary domain.

## Example

```ts
const params: GetPrimaryDomainParams = { rpc, walletAddress };
```

## Properties

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetTokenLargestAccountsApi`\>

Defined in: [address/getPrimaryDomain.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/address/getPrimaryDomain.ts#L27)

RPC client.

***

### walletAddress

> **walletAddress**: `Address`

Defined in: [address/getPrimaryDomain.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/address/getPrimaryDomain.ts#L29)

Wallet address.
