---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / getSolNftsForAddress

# Function: getSolNftsForAddress()

> **getSolNftsForAddress**(`params`): `Promise`\<[`GetSolNftsForAddressResult`](../interfaces/GetSolNftsForAddressResult.md)[]\>

Defined in: [address/getSolNftsForAddress.ts:99](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/address/getSolNftsForAddress.ts#L99)

Retrieves non-expired tokenized `.sol` domains held by an address.

Malformed or nonmatching candidates are skipped, while RPC failures
propagate to the caller.

## Parameters

### params

[`GetSolNftsForAddressParams`](../interfaces/GetSolNftsForAddressParams.md)

Tokenized-domain retrieval parameters

## Returns

`Promise`\<[`GetSolNftsForAddressResult`](../interfaces/GetSolNftsForAddressResult.md)[]\>

Non-expired tokenized-domain records with TLD-trimmed names, SRS record addresses, and mint addresses.

## Example

```ts
const domains = await getSolNftsForAddress({ rpc, address });
```
