---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / getSnsDomainsForAddress

# Function: getSnsDomainsForAddress()

> **getSnsDomainsForAddress**(`params`): `Promise`\<[`GetSnsDomainsForAddressResult`](../interfaces/GetSnsDomainsForAddressResult.md)[]\>

Defined in: [address/getSnsDomainsForAddress.ts:64](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/address/getSnsDomainsForAddress.ts#L64)

Retrieves directly registry-owned top-level SNS domains for an address.

Tokenized domains and subdomains are not included. Entries without reverse
lookup results are omitted.

## Parameters

### params

[`GetSnsDomainsForAddressParams`](../interfaces/GetSnsDomainsForAddressParams.md)

Domain retrieval parameters

## Returns

`Promise`\<[`GetSnsDomainsForAddressResult`](../interfaces/GetSnsDomainsForAddressResult.md)[]\>

Domain records with names without a TLD suffix and domain addresses.

## Example

```ts
const domains = await getSnsDomainsForAddress({ rpc, address });
```
