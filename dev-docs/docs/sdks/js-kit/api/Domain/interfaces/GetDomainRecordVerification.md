---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordVerification

# Interface: GetDomainRecordVerification

Defined in: [domain/getDomainRecord.ts:73](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainRecord.ts#L73)

Verification status for a domain record.

## Example

```ts
const verified: GetDomainRecordVerification = { staleness: true };
```

## Properties

### roa?

> `optional` **roa?**: `boolean`

Defined in: [domain/getDomainRecord.ts:77](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainRecord.ts#L77)

Right of Association verification result.

***

### staleness

> **staleness**: `boolean`

Defined in: [domain/getDomainRecord.ts:75](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainRecord.ts#L75)

Whether the record is current.
