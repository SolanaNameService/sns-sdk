---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / transferSubdomain

# Function: transferSubdomain()

> **transferSubdomain**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/transferSubdomain.ts:51](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/transferSubdomain.ts#L51)

Builds an instruction to transfer a `.sns` subdomain.

## Parameters

### params

[`TransferSubdomainParams`](../interfaces/TransferSubdomainParams.md)

Transfer parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await transferSubdomain({ rpc, subdomain: "sub.example.sns", newOwner });
```
