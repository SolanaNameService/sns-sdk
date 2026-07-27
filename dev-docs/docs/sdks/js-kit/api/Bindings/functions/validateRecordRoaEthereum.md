---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / validateRecordRoaEthereum

# Function: validateRecordRoaEthereum()

> **validateRecordRoaEthereum**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/validateRecordRoaEthereum.ts:64](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/bindings/validateRecordRoaEthereum.ts#L64)

Builds an instruction to validate a V2 record's Right of Association with an Ethereum signature.

## Parameters

### params

[`ValidateRecordRoaEthereumParams`](../interfaces/ValidateRecordRoaEthereumParams.md)

Record validation parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await validateRecordRoaEthereum({
  domain: "example.sns",
  record: Record.ETH,
  owner,
  payer,
  signature,
  expectedPubkey,
});
```
