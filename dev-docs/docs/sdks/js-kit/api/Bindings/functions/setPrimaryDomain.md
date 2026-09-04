---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / setPrimaryDomain

# Function: setPrimaryDomain()

> **setPrimaryDomain**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/setPrimaryDomain.ts:48](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/setPrimaryDomain.ts#L48)

Sets the primary domain for the specified owner.

This is an address-only API: `domainAddress` must be an already-derived SNS
domain account.

## Parameters

### params

[`SetPrimaryDomainParams`](../interfaces/SetPrimaryDomainParams.md)

Primary-domain registration parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await setPrimaryDomain({ rpc, domainAddress, owner });
```
