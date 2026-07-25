---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / GetSnsNftsForAddressParams

# Interface: GetSnsNftsForAddressParams

Defined in: [address/getSnsNftsForAddress.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/address/getSnsNftsForAddress.ts#L22)

Parameters for retrieving SNS domain NFTs owned by an address.

## Example

```ts
const params: GetSnsNftsForAddressParams = { rpc, address };
```

## Properties

### address

> **address**: `Address`

Defined in: [address/getSnsNftsForAddress.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/address/getSnsNftsForAddress.ts#L26)

Owner address.

***

### rpc

> **rpc**: `Rpc`\<`GetMultipleAccountsApi` & `GetProgramAccountsApi`\>

Defined in: [address/getSnsNftsForAddress.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/address/getSnsNftsForAddress.ts#L24)

RPC client.
