---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetSolDomainAddressResult

# Interface: GetSolDomainAddressResult

Defined in: [domain/getSolDomainAddress.ts:28](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSolDomainAddress.ts#L28)

A derived SRS `.sol` domain address and canonical name hash.

## Example

```ts
const derived: GetSolDomainAddressResult = { domainAddress, hashed };
```

## Properties

### domainAddress

> **domainAddress**: `Address`

Defined in: [domain/getSolDomainAddress.ts:30](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSolDomainAddress.ts#L30)

Derived SRS record address.

***

### hashed

> **hashed**: `Uint8Array`

Defined in: [domain/getSolDomainAddress.ts:32](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSolDomainAddress.ts#L32)

SHA-256 hash of the canonical name.
