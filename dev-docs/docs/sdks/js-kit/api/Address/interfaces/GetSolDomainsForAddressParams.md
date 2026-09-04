---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetSolDomainsForAddressParams

# Interface: GetSolDomainsForAddressParams

Defined in: [address/getSolDomainsForAddress.ts:32](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolDomainsForAddress.ts#L32)

Parameters for retrieving directly owned SRS `.sol` domains.

## Example

```ts
const params: GetSolDomainsForAddressParams = { rpc, address };
```

## Properties

### address

> **address**: `Address`

Defined in: [address/getSolDomainsForAddress.ts:36](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolDomainsForAddress.ts#L36)

Wallet address whose directly owned records are retrieved.

***

### rpc

> **rpc**: `Rpc`\<`GetProgramAccountsApi`\>

Defined in: [address/getSolDomainsForAddress.ts:34](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolDomainsForAddress.ts#L34)

RPC client.
