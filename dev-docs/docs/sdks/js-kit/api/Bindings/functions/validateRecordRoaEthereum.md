---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / validateRecordRoaEthereum

# Function: validateRecordRoaEthereum()

> **validateRecordRoaEthereum**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/validateRecordRoaEthereum.ts:64](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/validateRecordRoaEthereum.ts#L64)

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
