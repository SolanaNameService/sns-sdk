---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / createRecord

# Function: createRecord()

> **createRecord**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/createRecord.ts:67](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/bindings/createRecord.ts#L67)

Builds an instruction to create a V2 record for a `.sns` domain or subdomain.

Record content is serialized according to SNS-IP 1.

## Parameters

### params

[`CreateRecordParams`](../interfaces/CreateRecordParams.md)

Record creation parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await createRecord({
  domain: "example.sns",
  record: Record.Url,
  content: "https://example.com",
  owner,
  payer,
});
```
