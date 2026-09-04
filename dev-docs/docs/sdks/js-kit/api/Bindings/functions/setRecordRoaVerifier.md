---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / setRecordRoaVerifier

# Function: setRecordRoaVerifier()

> **setRecordRoaVerifier**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/setRecordRoaVerifier.ts:38](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/setRecordRoaVerifier.ts#L38)

Builds an instruction to store the expected Right of Association verifier for a V2 record.

## Parameters

### params

[`RecordVerificationParams`](../interfaces/RecordVerificationParams.md)

V2 record validation parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await setRecordRoaVerifier({
  domain: "example.sns",
  record: Record.Url,
  owner,
  payer,
  verifier,
});
```
