---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / GetReverseAddressFromDomainAddressParams

# Interface: GetReverseAddressFromDomainAddressParams

Defined in: [utils/getReverseAddressFromDomainAddress.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/utils/getReverseAddressFromDomainAddress.ts#L14)

Parameters for deriving a reverse lookup address.

## Example

```ts
const params: GetReverseAddressFromDomainAddressParams = { domainAddress };
```

## Properties

### domainAddress

> **domainAddress**: `Address`

Defined in: [utils/getReverseAddressFromDomainAddress.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/utils/getReverseAddressFromDomainAddress.ts#L16)

Domain account address.

***

### parentAddress?

> `optional` **parentAddress?**: `Address`

Defined in: [utils/getReverseAddressFromDomainAddress.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/utils/getReverseAddressFromDomainAddress.ts#L18)

Parent domain address for a subdomain.
