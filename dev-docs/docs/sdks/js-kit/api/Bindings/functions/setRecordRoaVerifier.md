---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / setRecordRoaVerifier

# Function: setRecordRoaVerifier()

> **setRecordRoaVerifier**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/setRecordRoaVerifier.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/setRecordRoaVerifier.ts#L38)

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
