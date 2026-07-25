---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / validateRecordRoa

# Function: validateRecordRoa()

> **validateRecordRoa**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/validateRecordRoa.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/validateRecordRoa.ts#L30)

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
