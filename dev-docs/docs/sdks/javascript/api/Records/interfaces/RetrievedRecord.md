---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / RetrievedRecord

# Interface: RetrievedRecord

Defined in: [record/getRecord.ts:83](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/record/getRecord.ts#L83)

Raw SNS record account data returned by the records program.

## Example

```ts
{
  header: {
    stalenessValidation: Validation.Solana,
    rightOfAssociationValidation: Validation.Solana,
    contentLength: 19,
  },
  data: Buffer.from("https://example.com"),
}
```

## Properties

### data

> **data**: `Buffer`

Defined in: [record/getRecord.ts:91](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/record/getRecord.ts#L91)

Complete encoded account data.

***

### header

> **header**: `object`

Defined in: [record/getRecord.ts:85](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/record/getRecord.ts#L85)

Record header containing validation modes and payload length.

#### contentLength

> **contentLength**: `number`

#### rightOfAssociationValidation

> **rightOfAssociationValidation**: `number`

#### stalenessValidation

> **stalenessValidation**: `number`

## Methods

### getContent()

> **getContent**(): `Buffer`

Defined in: [record/getRecord.ts:94](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/record/getRecord.ts#L94)

Returns the record payload bytes.

#### Returns

`Buffer`

***

### getRoAId()

> **getRoAId**(): `Buffer`

Defined in: [record/getRecord.ts:100](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/record/getRecord.ts#L100)

Returns the identifier bytes used for right-of-association validation.

#### Returns

`Buffer`

***

### getStalenessId()

> **getStalenessId**(): `Buffer`

Defined in: [record/getRecord.ts:97](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/record/getRecord.ts#L97)

Returns the public-key bytes used for staleness validation.

#### Returns

`Buffer`
