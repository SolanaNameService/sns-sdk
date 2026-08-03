---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / setRecordStalenessVerifier

# Function: setRecordStalenessVerifier()

> **setRecordStalenessVerifier**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/setRecordStalenessVerifier.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/setRecordStalenessVerifier.ts#L30)

Builds an instruction to write or refresh staleness verifier metadata for a V2 record.

## Parameters

### params

[`RecordVerificationParams`](../interfaces/RecordVerificationParams.md)

V2 record validation parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await setRecordStalenessVerifier({
  domain: "example.sns",
  record: Record.Url,
  owner,
  payer,
  verifier,
});
```
