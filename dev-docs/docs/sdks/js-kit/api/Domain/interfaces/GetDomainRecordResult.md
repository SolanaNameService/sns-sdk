---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordResult

# Interface: GetDomainRecordResult

Defined in: [domain/getDomainRecord.ts:88](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L88)

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

Defined in: [domain/getDomainRecord.ts:96](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L96)

Decoded record content.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [domain/getDomainRecord.ts:90](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L90)

Record type.

***

### retrievedRecord

> **retrievedRecord**: [`RecordState`](../../States/classes/RecordState.md)

Defined in: [domain/getDomainRecord.ts:92](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L92)

Retrieved record state.

***

### verified

> **verified**: [`GetDomainRecordVerification`](GetDomainRecordVerification.md)

Defined in: [domain/getDomainRecord.ts:94](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L94)

Verification status.
