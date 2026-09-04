---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / ReverseLookupBatchParams

# Interface: ReverseLookupBatchParams

Defined in: [utils/reverseLookupBatch.ts:15](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/utils/reverseLookupBatch.ts#L15)

Parameters for batch reverse lookup.

## Example

```ts
const params: ReverseLookupBatchParams = { rpc, domainAddresses };
```

## Properties

### domainAddresses

> **domainAddresses**: `Address`[]

Defined in: [utils/reverseLookupBatch.ts:19](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/utils/reverseLookupBatch.ts#L19)

Domain account addresses.

***

### rpc

> **rpc**: `Rpc`\<`GetMultipleAccountsApi`\>

Defined in: [utils/reverseLookupBatch.ts:17](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/utils/reverseLookupBatch.ts#L17)

RPC client.
