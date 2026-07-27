---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / updateNameRegistry

# Function: updateNameRegistry()

> **updateNameRegistry**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/updateNameRegistry.ts:67](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/bindings/updateNameRegistry.ts#L67)

Updates the data of a raw SPL Name Registry account.

This low-level helper accepts a raw registry seed/name as `domain` and does
not parse `.sns` or `.sol` suffixes.

## Parameters

### params

[`UpdateNameRegistryParams`](../interfaces/UpdateNameRegistryParams.md)

Update parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await updateNameRegistry({
  rpc,
  domain: "example",
  offset: 0,
  data: new TextEncoder().encode("data"),
});
```
