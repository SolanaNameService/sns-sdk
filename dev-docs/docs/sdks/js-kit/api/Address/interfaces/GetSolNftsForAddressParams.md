---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetSolNftsForAddressParams

# Interface: GetSolNftsForAddressParams

Defined in: [address/getSolNftsForAddress.ts:46](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolNftsForAddress.ts#L46)

Parameters for retrieving tokenized SRS `.sol` domains.

## Example

```ts
const params: GetSolNftsForAddressParams = { rpc, address };
```

## Properties

### address

> **address**: `Address`

Defined in: [address/getSolNftsForAddress.ts:50](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolNftsForAddress.ts#L50)

Wallet address holding the tokenized domains.

***

### rpc

> **rpc**: `Rpc`\<`GetProgramAccountsApi` & `GetMultipleAccountsApi`\>

Defined in: [address/getSolNftsForAddress.ts:48](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolNftsForAddress.ts#L48)

RPC client implementing program-account and multiple-account lookup APIs.
