---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetSolDomainAddressParams

# Interface: GetSolDomainAddressParams

Defined in: [domain/getSolDomainAddress.ts:15](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSolDomainAddress.ts#L15)

Parameters for deriving an SRS `.sol` domain address.

## Example

```ts
const params: GetSolDomainAddressParams = { domain: "example" };
```

## Properties

### domain

> **domain**: `string`

Defined in: [domain/getSolDomainAddress.ts:17](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSolDomainAddress.ts#L17)

TLD-trimmed `.sol` domain name.
