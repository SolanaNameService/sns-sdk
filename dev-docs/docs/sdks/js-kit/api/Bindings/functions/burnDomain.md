---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / burnDomain

# Function: burnDomain()

> **burnDomain**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/burnDomain.ts:50](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/burnDomain.ts#L50)

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
