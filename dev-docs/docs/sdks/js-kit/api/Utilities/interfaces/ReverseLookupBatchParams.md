---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / ReverseLookupBatchParams

# Interface: ReverseLookupBatchParams

Defined in: [utils/reverseLookupBatch.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/reverseLookupBatch.ts#L15)

Parameters for batch reverse lookup.

## Example

```ts
const params: ReverseLookupBatchParams = { rpc, domainAddresses };
```

## Properties

### domainAddresses

> **domainAddresses**: `Address`[]

Defined in: [utils/reverseLookupBatch.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/reverseLookupBatch.ts#L19)

Domain account addresses.

***

### rpc

> **rpc**: `Rpc`\<`GetMultipleAccountsApi`\>

Defined in: [utils/reverseLookupBatch.ts:17](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/reverseLookupBatch.ts#L17)

RPC client.
