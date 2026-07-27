---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / createReverse

# Function: createReverse()

> **createReverse**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/createReverse.ts:54](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/bindings/createReverse.ts#L54)

Creates a raw reverse lookup record for the specified domain account.

This low-level helper accepts the stored reverse payload as `domain` and
does not parse `.sns` or `.sol` suffixes.

## Parameters

### params

[`CreateReverseParams`](../interfaces/CreateReverseParams.md)

Reverse lookup creation parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await createReverse({ domainAddress, domain: "example", payer });
```
