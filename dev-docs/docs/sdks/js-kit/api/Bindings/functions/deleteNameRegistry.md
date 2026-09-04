---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / deleteNameRegistry

# Function: deleteNameRegistry()

> **deleteNameRegistry**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/deleteNameRegistry.ts:49](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/deleteNameRegistry.ts#L49)

Deletes a raw SPL Name Registry account and refunds the associated rent
balance to the specified target.

This low-level helper accepts a raw registry seed/name and does not parse
`.sns` or `.sol` suffixes.

## Parameters

### params

[`DeleteNameRegistryParams`](../interfaces/DeleteNameRegistryParams.md)

Deletion parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await deleteNameRegistry({ rpc, name: "example", refundAddress });
```
