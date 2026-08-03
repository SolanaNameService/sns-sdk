---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / getReverseAddressFromDomainAddress

# Function: getReverseAddressFromDomainAddress()

> **getReverseAddressFromDomainAddress**(`params`): `Promise`\<`Address`\>

Defined in: [utils/getReverseAddressFromDomainAddress.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/utils/getReverseAddressFromDomainAddress.ts#L34)

Derives the reverse lookup account address from a domain address.

## Parameters

### params

[`GetReverseAddressFromDomainAddressParams`](../interfaces/GetReverseAddressFromDomainAddressParams.md)

Reverse lookup derivation parameters

## Returns

`Promise`\<`Address`\>

The reverse lookup account address.

## Example

```ts
const address = await getReverseAddressFromDomainAddress({ domainAddress });
```
