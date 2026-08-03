---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / createNameRegistry

# Function: createNameRegistry()

> **createNameRegistry**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/createNameRegistry.ts:67](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createNameRegistry.ts#L67)

Creates a raw SPL Name Registry account with the given rent budget,
allocated space, owner, and class.

This low-level helper accepts a raw registry seed/name and does not parse
`.sns` or `.sol` suffixes.

## Parameters

### params

[`CreateNameRegistryParams`](../interfaces/CreateNameRegistryParams.md)

Creation parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await createNameRegistry({ rpc, name: "example", space: 32, payer, owner });
```
