---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / setPrimaryDomain

# Function: setPrimaryDomain()

> **setPrimaryDomain**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/setPrimaryDomain.ts:48](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/setPrimaryDomain.ts#L48)

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
