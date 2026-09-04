---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / transferDomain

# Function: transferDomain()

> **transferDomain**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/transferDomain.ts:43](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/transferDomain.ts#L43)

Builds an instruction to transfer a top-level `.sns` domain.

## Parameters

### params

[`TransferDomainParams`](../interfaces/TransferDomainParams.md)

Transfer parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await transferDomain({ rpc, domain: "example.sns", newOwner });
```
