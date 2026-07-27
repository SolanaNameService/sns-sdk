---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / transferSubdomain

# Function: transferSubdomain()

> **transferSubdomain**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/transferSubdomain.ts:51](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/bindings/transferSubdomain.ts#L51)

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
