---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getSrsDomainAddress

# Function: getSrsDomainAddress()

> **getSrsDomainAddress**(`params`): `Promise`\<[`GetSrsDomainAddressResult`](../interfaces/GetSrsDomainAddressResult.md)\>

Defined in: [domain/getSrsDomainAddress.ts:47](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getSrsDomainAddress.ts#L47)

Derives the canonical SRS record address for a TLD-trimmed `.sol` name.

## Parameters

### params

[`GetSrsDomainAddressParams`](../interfaces/GetSrsDomainAddressParams.md)

Derivation parameters

## Returns

`Promise`\<[`GetSrsDomainAddressResult`](../interfaces/GetSrsDomainAddressResult.md)\>

The SRS record address and canonical name hash.

## Example

```ts
const derived = await getSrsDomainAddress({ domain: "example" });
```
