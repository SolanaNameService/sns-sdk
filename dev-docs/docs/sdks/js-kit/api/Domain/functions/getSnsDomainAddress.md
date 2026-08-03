---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getSnsDomainAddress

# Function: getSnsDomainAddress()

> **getSnsDomainAddress**(`params`): `Promise`\<[`GetSnsDomainAddressResult`](../interfaces/GetSnsDomainAddressResult.md)\>

Defined in: [domain/getSnsDomainAddress.ts:61](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getSnsDomainAddress.ts#L61)

Derives the address of a domain, subdomain, or record account.

## Parameters

### params

[`GetSnsDomainAddressParams`](../interfaces/GetSnsDomainAddressParams.md)

Derivation parameters

## Returns

`Promise`\<[`GetSnsDomainAddressResult`](../interfaces/GetSnsDomainAddressResult.md)\>

Derived account address and metadata describing top-level, subdomain, or sub-record derivation.

## Example

```ts
const derived = await getSnsDomainAddress({ domain: "example" });
```
