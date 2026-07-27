---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / createSubdomain

# Function: createSubdomain()

> **createSubdomain**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>[]\>

Defined in: [bindings/createSubdomain.ts:61](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/bindings/createSubdomain.ts#L61)

Builds the instructions to create a `.sns` subdomain.

The subdomain registry instruction is always included. The reverse lookup
instruction is included only when the reverse lookup account does not exist.

## Parameters

### params

[`CreateSubdomainParams`](../interfaces/CreateSubdomainParams.md)

Subdomain creation parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>[]\>

Transaction instructions.

## Example

```ts
const instructions = await createSubdomain({ rpc, subdomain: "sub.example.sns", owner });
```
