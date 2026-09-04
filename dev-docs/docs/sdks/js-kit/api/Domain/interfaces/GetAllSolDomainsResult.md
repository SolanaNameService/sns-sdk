---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetAllSolDomainsResult

# Interface: GetAllSolDomainsResult

Defined in: [domain/getAllSolDomains.ts:39](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getAllSolDomains.ts#L39)

A top-level SRS `.sol` domain record.

## Example

```ts
const domain: GetAllSolDomainsResult = { domainAddress, owner };
```

## Properties

### domainAddress

> **domainAddress**: `Address`

Defined in: [domain/getAllSolDomains.ts:41](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getAllSolDomains.ts#L41)

SRS record address.

***

### owner

> **owner**: `Address`

Defined in: [domain/getAllSolDomains.ts:43](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getAllSolDomains.ts#L43)

Raw SRS owner, either a wallet address or Token-2022 mint.
