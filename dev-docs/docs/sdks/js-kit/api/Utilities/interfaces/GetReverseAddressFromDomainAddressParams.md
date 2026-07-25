---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / GetReverseAddressFromDomainAddressParams

# Interface: GetReverseAddressFromDomainAddressParams

Defined in: [utils/getReverseAddressFromDomainAddress.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/utils/getReverseAddressFromDomainAddress.ts#L14)

Parameters for deriving a reverse lookup address.

## Example

```ts
const params: GetReverseAddressFromDomainAddressParams = { domainAddress };
```

## Properties

### domainAddress

> **domainAddress**: `Address`

Defined in: [utils/getReverseAddressFromDomainAddress.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/utils/getReverseAddressFromDomainAddress.ts#L16)

Domain account address.

***

### parentAddress?

> `optional` **parentAddress?**: `Address`

Defined in: [utils/getReverseAddressFromDomainAddress.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/utils/getReverseAddressFromDomainAddress.ts#L18)

Parent domain address for a subdomain.
