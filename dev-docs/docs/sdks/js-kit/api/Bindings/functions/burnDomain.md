---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / burnDomain

# Function: burnDomain()

> **burnDomain**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/burnDomain.ts:50](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/burnDomain.ts#L50)

Builds an instruction to burn a top-level `.sns` domain.

## Parameters

### params

[`BurnDomainParams`](../interfaces/BurnDomainParams.md)

Burn parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await burnDomain({ domain: "example.sns", owner, refundAddress });
```
