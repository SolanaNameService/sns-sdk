---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetSrsDomainAddressResult

# Interface: GetSrsDomainAddressResult

Defined in: [domain/getSrsDomainAddress.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getSrsDomainAddress.ts#L28)

A derived SRS domain address.

## Example

```ts
const derived: GetSrsDomainAddressResult = { domainAddress, hashed };
```

## Properties

### domainAddress

> **domainAddress**: `Address`

Defined in: [domain/getSrsDomainAddress.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getSrsDomainAddress.ts#L30)

Derived SRS record address.

***

### hashed

> **hashed**: `Uint8Array`

Defined in: [domain/getSrsDomainAddress.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getSrsDomainAddress.ts#L32)

SHA-256 hash of the canonical name.
