---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / deleteRecord

# Function: deleteRecord()

> **deleteRecord**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/deleteRecord.ts:59](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/deleteRecord.ts#L59)

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
