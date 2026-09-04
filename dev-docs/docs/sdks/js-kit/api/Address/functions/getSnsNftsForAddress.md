---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / getSnsNftsForAddress

# Function: getSnsNftsForAddress()

> **getSnsNftsForAddress**(`params`): `Promise`\<[`GetSnsNftsForAddressResult`](../interfaces/GetSnsNftsForAddressResult.md)[]\>

Defined in: [address/getSnsNftsForAddress.ts:125](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSnsNftsForAddress.ts#L125)

Retrieves the SNS domain NFTs owned by a given address.

Returned `domain` values do not include a `.sns` or `.sol` suffix.
If NFT records cannot be retrieved or decoded, this function returns an empty
array instead of throwing.

Entries without reverse lookup results are omitted.

## Parameters

### params

[`GetSnsNftsForAddressParams`](../interfaces/GetSnsNftsForAddressParams.md)

Tokenized domain retrieval parameters

## Returns

`Promise`\<[`GetSnsNftsForAddressResult`](../interfaces/GetSnsNftsForAddressResult.md)[]\>

Tokenized domain records with names without a TLD suffix, domain addresses, and mints.

## Example

```ts
const domains = await getSnsNftsForAddress({ rpc, address });
```
