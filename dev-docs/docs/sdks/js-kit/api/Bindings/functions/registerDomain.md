---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / registerDomain

# Function: registerDomain()

> **registerDomain**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>[]\>

Defined in: [bindings/registerDomain.ts:82](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/bindings/registerDomain.ts#L82)

Builds the instructions to register a top-level `.sns` domain.

If a supported referrer is provided, the returned instructions include an
idempotent associated token account creation instruction before the
registration instruction.

## Parameters

### params

[`RegisterDomainParams`](../interfaces/RegisterDomainParams.md)

Registration parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>[]\>

Transaction instructions.

## Example

```ts
const instructions = await registerDomain({
  domain: "example.sns",
  space: 1_000,
  buyer,
  buyerTokenAccount,
});
```
