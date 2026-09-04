---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getSolDomainAddress

# Function: getSolDomainAddress()

> **getSolDomainAddress**(`params`): `Promise`\<[`GetSolDomainAddressResult`](../interfaces/GetSolDomainAddressResult.md)\>

Defined in: [domain/getSolDomainAddress.ts:47](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSolDomainAddress.ts#L47)

Derives the canonical SRS record address for a TLD-trimmed `.sol` name.

## Parameters

### params

[`GetSolDomainAddressParams`](../interfaces/GetSolDomainAddressParams.md)

Derivation parameters

## Returns

`Promise`\<[`GetSolDomainAddressResult`](../interfaces/GetSolDomainAddressResult.md)\>

The SRS record address and canonical name hash.

## Example

```ts
const derived = await getSolDomainAddress({ domain: "example" });
```
