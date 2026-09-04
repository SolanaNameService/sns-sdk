---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordsVerification

# Interface: GetDomainRecordsVerification

Defined in: [domain/getDomainRecords.ts:79](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L79)

Verification status for a domain record.

## Example

```ts
const verified: GetDomainRecordsVerification = { staleness: true };
```

## Properties

### roa?

> `optional` **roa?**: `boolean`

Defined in: [domain/getDomainRecords.ts:83](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L83)

Right of Association verification result.

***

### staleness

> **staleness**: `boolean`

Defined in: [domain/getDomainRecords.ts:81](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L81)

Whether the record is current.
