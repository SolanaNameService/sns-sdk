---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordsResult

# Interface: GetDomainRecordsResult

Defined in: [domain/getDomainRecords.ts:102](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L102)

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

Defined in: [domain/getDomainRecords.ts:110](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L110)

Decoded record content.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [domain/getDomainRecords.ts:104](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L104)

Record type.

***

### retrievedRecord

> **retrievedRecord**: [`RecordState`](../../States/classes/RecordState.md)

Defined in: [domain/getDomainRecords.ts:106](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L106)

Retrieved record state.

***

### verified

> **verified**: [`GetDomainRecordsVerification`](GetDomainRecordsVerification.md)

Defined in: [domain/getDomainRecords.ts:108](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L108)

Verification status.
