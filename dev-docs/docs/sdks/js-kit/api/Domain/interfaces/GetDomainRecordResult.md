---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordResult

# Interface: GetDomainRecordResult

Defined in: [domain/getDomainRecord.ts:92](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainRecord.ts#L92)

A retrieved domain record.

## Example

```ts
const result: GetDomainRecordResult = {
  record: Record.Url,
  retrievedRecord,
  verified: { staleness: true },
};
```

## Properties

### deserializedContent?

> `optional` **deserializedContent?**: `string`

Defined in: [domain/getDomainRecord.ts:100](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainRecord.ts#L100)

Decoded record content.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [domain/getDomainRecord.ts:94](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainRecord.ts#L94)

Record type.

***

### retrievedRecord

> **retrievedRecord**: [`RecordState`](../../States/classes/RecordState.md)

Defined in: [domain/getDomainRecord.ts:96](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainRecord.ts#L96)

Retrieved record state.

***

### verified

> **verified**: [`GetDomainRecordVerification`](GetDomainRecordVerification.md)

Defined in: [domain/getDomainRecord.ts:98](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainRecord.ts#L98)

Verification status.
