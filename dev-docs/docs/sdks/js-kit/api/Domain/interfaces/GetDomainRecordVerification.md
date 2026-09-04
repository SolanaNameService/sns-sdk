---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordVerification

# Interface: GetDomainRecordVerification

Defined in: [domain/getDomainRecord.ts:69](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L69)

Verification status for a domain record.

## Example

```ts
const verified: GetDomainRecordVerification = { staleness: true };
```

## Properties

### roa?

> `optional` **roa?**: `boolean`

Defined in: [domain/getDomainRecord.ts:73](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L73)

Right of Association verification result.

***

### staleness

> **staleness**: `boolean`

Defined in: [domain/getDomainRecord.ts:71](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L71)

Whether the record is current.
