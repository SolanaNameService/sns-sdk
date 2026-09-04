---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / DeleteRecordParams

# Interface: DeleteRecordParams

Defined in: [bindings/deleteRecord.ts:28](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/deleteRecord.ts#L28)

Parameters for deleting a domain record.

## Example

```ts
const params: DeleteRecordParams = {
  domain: "example.sns",
  record: Record.Url,
  owner,
  payer,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [bindings/deleteRecord.ts:30](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/deleteRecord.ts#L30)

Full `.sns` domain name.

***

### owner

> **owner**: `Address`

Defined in: [bindings/deleteRecord.ts:34](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/deleteRecord.ts#L34)

Current domain owner.

***

### payer

> **payer**: `Address`

Defined in: [bindings/deleteRecord.ts:36](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/deleteRecord.ts#L36)

Instruction fee payer.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [bindings/deleteRecord.ts:32](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/deleteRecord.ts#L32)

Record type.
