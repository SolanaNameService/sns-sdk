---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / getSolDomainsForAddress

# Function: getSolDomainsForAddress()

> **getSolDomainsForAddress**(`params`): `Promise`\<[`GetSolDomainsForAddressResult`](../interfaces/GetSolDomainsForAddressResult.md)[]\>

Defined in: [address/getSolDomainsForAddress.ts:75](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolDomainsForAddress.ts#L75)

Retrieves non-expired, directly wallet-owned top-level `.sol` domains.

Tokenized records and malformed individual records are omitted. RPC
failures are propagated to the caller.

## Parameters

### params

[`GetSolDomainsForAddressParams`](../interfaces/GetSolDomainsForAddressParams.md)

Domain retrieval parameters

## Returns

`Promise`\<[`GetSolDomainsForAddressResult`](../interfaces/GetSolDomainsForAddressResult.md)[]\>

Non-expired direct-domain records with TLD-trimmed names and SRS record addresses.

## Example

```ts
const domains = await getSolDomainsForAddress({ rpc, address });
```
