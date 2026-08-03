---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordsVerification

# Interface: GetDomainRecordsVerification

Defined in: [domain/getDomainRecords.ts:83](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getDomainRecords.ts#L83)

Verification status for a domain record.

## Example

```ts
const verified: GetDomainRecordsVerification = { staleness: true };
```

## Properties

### roa?

> `optional` **roa?**: `boolean`

Defined in: [domain/getDomainRecords.ts:87](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getDomainRecords.ts#L87)

Right of Association verification result.

***

### staleness

> **staleness**: `boolean`

Defined in: [domain/getDomainRecords.ts:85](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getDomainRecords.ts#L85)

Whether the record is current.
