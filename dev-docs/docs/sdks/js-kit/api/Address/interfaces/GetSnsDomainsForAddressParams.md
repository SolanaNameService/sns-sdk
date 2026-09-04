---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetSnsDomainsForAddressParams

# Interface: GetSnsDomainsForAddressParams

Defined in: [address/getSnsDomainsForAddress.ts:23](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSnsDomainsForAddress.ts#L23)

Parameters for retrieving SNS domains owned by an address.

## Example

```ts
const params: GetSnsDomainsForAddressParams = { rpc, address };
```

## Properties

### address

> **address**: `Address`

Defined in: [address/getSnsDomainsForAddress.ts:27](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSnsDomainsForAddress.ts#L27)

Owner address.

***

### rpc

> **rpc**: `Rpc`\<`GetProgramAccountsApi` & `GetMultipleAccountsApi`\>

Defined in: [address/getSnsDomainsForAddress.ts:25](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSnsDomainsForAddress.ts#L25)

RPC client.
