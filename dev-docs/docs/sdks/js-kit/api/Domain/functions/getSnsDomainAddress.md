---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getSnsDomainAddress

# Function: getSnsDomainAddress()

> **getSnsDomainAddress**(`params`): `Promise`\<[`GetSnsDomainAddressResult`](../interfaces/GetSnsDomainAddressResult.md)\>

Defined in: [domain/getSnsDomainAddress.ts:61](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getSnsDomainAddress.ts#L61)

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
