---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / RecordResult

# Interface: RecordResult

Defined in: [record/getRecord.ts:44](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/record/getRecord.ts#L44)

Result returned by [getRecord](../functions/getRecord.md) and by defined entries from
[getMultipleRecords](../functions/getMultipleRecords.md).

## Example

```ts
{
  record: Record.Url,
  retrievedRecord: retrievedUrlRecord,
  verified: {
    staleness: true,
    roa: true,
  },
  deserializedContent: "https://example.com",
}
```

## Properties

### deserializedContent?

> `optional` **deserializedContent?**: `string`

Defined in: [record/getRecord.ts:66](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/record/getRecord.ts#L66)

Record payload decoded to its display string. Present only when the caller
sets `options.deserialize` to `true`.

***

### record

> **record**: [`Record`](../enumerations/Record.md)

Defined in: [record/getRecord.ts:46](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/record/getRecord.ts#L46)

Record type requested by the caller.

***

### retrievedRecord

> **retrievedRecord**: [`RetrievedRecord`](RetrievedRecord.md)

Defined in: [record/getRecord.ts:49](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/record/getRecord.ts#L49)

Raw V2 record account, including its header and encoded payload.

***

### verified

> **verified**: `object`

Defined in: [record/getRecord.ts:52](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/record/getRecord.ts#L52)

Verification results for the current effective domain owner and record verifier.

#### roa?

> `optional` **roa?**: `boolean`

Whether the Right of Association identifier matches the expected
self-signed or guardian verifier and the header declares the required
validation scheme. Omitted when the record type has no configured verifier.

#### staleness

> **staleness**: `boolean`

Whether the staleness identifier and validation mode match the domain owner.
