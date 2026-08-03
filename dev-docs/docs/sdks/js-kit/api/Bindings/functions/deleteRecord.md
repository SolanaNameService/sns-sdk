---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / deleteRecord

# Function: deleteRecord()

> **deleteRecord**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/deleteRecord.ts:59](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/deleteRecord.ts#L59)

Builds an instruction to delete a V2 record for a `.sns` domain or subdomain.

## Parameters

### params

[`DeleteRecordParams`](../interfaces/DeleteRecordParams.md)

Record deletion parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await deleteRecord({
  domain: "example.sns",
  record: Record.Url,
  owner,
  payer,
});
```
