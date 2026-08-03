---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / UpdateRecordParams

# Interface: UpdateRecordParams

Defined in: [bindings/updateRecord.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/updateRecord.ts#L30)

Parameters for updating a domain record.

## Example

```ts
const params: UpdateRecordParams = {
  domain: "example.sns",
  record: Record.Url,
  content: "https://example.com",
  owner,
  payer,
};
```

## Properties

### content

> **content**: `string`

Defined in: [bindings/updateRecord.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/updateRecord.ts#L36)

Record content.

***

### domain

> **domain**: `string`

Defined in: [bindings/updateRecord.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/updateRecord.ts#L32)

Full `.sns` domain name.

***

### owner

> **owner**: `Address`

Defined in: [bindings/updateRecord.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/updateRecord.ts#L38)

Current domain owner.

***

### payer

> **payer**: `Address`

Defined in: [bindings/updateRecord.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/updateRecord.ts#L40)

Instruction fee payer.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [bindings/updateRecord.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/updateRecord.ts#L34)

Record type.
