---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / getReverseAddressFromDomainAddress

# Function: getReverseAddressFromDomainAddress()

> **getReverseAddressFromDomainAddress**(`params`): `Promise`\<`Address`\>

Defined in: [utils/getReverseAddressFromDomainAddress.ts:34](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/utils/getReverseAddressFromDomainAddress.ts#L34)

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
