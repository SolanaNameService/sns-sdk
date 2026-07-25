---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / validateRecordRoa

# Function: validateRecordRoa()

> **validateRecordRoa**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/validateRecordRoa.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/validateRecordRoa.ts#L30)

Builds an instruction to validate a V2 record's Right of Association with a Solana verifier.

## Parameters

### params

[`RecordVerificationParams`](../interfaces/RecordVerificationParams.md)

Record validation parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await validateRecordRoa({
  domain: "example.sns",
  record: Record.Url,
  owner,
  payer,
  verifier,
});
```
