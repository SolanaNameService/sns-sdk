---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetSnsDomainsForAddressParams

# Interface: GetSnsDomainsForAddressParams

Defined in: [address/getSnsDomainsForAddress.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/address/getSnsDomainsForAddress.ts#L23)

Parameters for retrieving SNS domains owned by an address.

## Example

```ts
const params: GetSnsDomainsForAddressParams = { rpc, address };
```

## Properties

### address

> **address**: `Address`

Defined in: [address/getSnsDomainsForAddress.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/address/getSnsDomainsForAddress.ts#L27)

Owner address.

***

### rpc

> **rpc**: `Rpc`\<`GetProgramAccountsApi` & `GetMultipleAccountsApi`\>

Defined in: [address/getSnsDomainsForAddress.ts:25](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/address/getSnsDomainsForAddress.ts#L25)

RPC client.
