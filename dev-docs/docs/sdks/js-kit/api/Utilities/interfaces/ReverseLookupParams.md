---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / ReverseLookupParams

# Interface: ReverseLookupParams

Defined in: [utils/reverseLookup.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/reverseLookup.ts#L16)

Parameters for reverse lookup.

## Example

```ts
const params: ReverseLookupParams = { rpc, domainAddress };
```

## Properties

### domainAddress

> **domainAddress**: `Address`

Defined in: [utils/reverseLookup.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/reverseLookup.ts#L20)

Domain account address.

***

### parentAddress?

> `optional` **parentAddress?**: `Address`

Defined in: [utils/reverseLookup.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/reverseLookup.ts#L22)

Parent domain address for a subdomain.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi`\>

Defined in: [utils/reverseLookup.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/reverseLookup.ts#L18)

RPC client.
