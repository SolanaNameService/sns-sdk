---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordsResult

# Interface: GetDomainRecordsResult

Defined in: [domain/getDomainRecords.ts:98](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L98)

A retrieved domain record.

## Example

```ts
const result: GetDomainRecordsResult = {
  record: Record.Url,
  retrievedRecord,
  verified: { staleness: true },
};
```

## Properties

### deserializedContent?

> `optional` **deserializedContent?**: `string`

Defined in: [domain/getDomainRecords.ts:106](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L106)

Decoded record content.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [domain/getDomainRecords.ts:100](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L100)

Record type.

***

### retrievedRecord

> **retrievedRecord**: [`RecordState`](../../States/classes/RecordState.md)

Defined in: [domain/getDomainRecords.ts:102](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L102)

Retrieved record state.

***

### verified

> **verified**: [`GetDomainRecordsVerification`](GetDomainRecordsVerification.md)

Defined in: [domain/getDomainRecords.ts:104](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L104)

Verification status.
