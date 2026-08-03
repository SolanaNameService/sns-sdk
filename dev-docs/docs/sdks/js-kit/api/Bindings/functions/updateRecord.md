---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / updateRecord

# Function: updateRecord()

> **updateRecord**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/updateRecord.ts:67](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/updateRecord.ts#L67)

Builds an instruction to update a V2 record for a `.sns` domain or subdomain.

Record content is serialized according to SNS-IP 1.

## Parameters

### params

[`UpdateRecordParams`](../interfaces/UpdateRecordParams.md)

Record update parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await updateRecord({
  domain: "example.sns",
  record: Record.Url,
  content: "https://example.com",
  owner,
  payer,
});
```
