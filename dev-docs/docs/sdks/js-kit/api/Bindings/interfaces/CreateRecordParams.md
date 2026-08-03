---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / CreateRecordParams

# Interface: CreateRecordParams

Defined in: [bindings/createRecord.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createRecord.ts#L30)

Parameters for creating a domain record.

## Example

```ts
const params: CreateRecordParams = {
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

Defined in: [bindings/createRecord.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createRecord.ts#L36)

Record content.

***

### domain

> **domain**: `string`

Defined in: [bindings/createRecord.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createRecord.ts#L32)

Full `.sns` domain name.

***

### owner

> **owner**: `Address`

Defined in: [bindings/createRecord.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createRecord.ts#L38)

Current domain owner.

***

### payer

> **payer**: `Address`

Defined in: [bindings/createRecord.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createRecord.ts#L40)

Instruction fee payer.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [bindings/createRecord.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createRecord.ts#L34)

Record type.
