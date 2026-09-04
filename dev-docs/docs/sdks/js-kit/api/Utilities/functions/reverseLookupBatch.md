---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / reverseLookupBatch

# Function: reverseLookupBatch()

> **reverseLookupBatch**(`params`): `Promise`\<(`string` \| `undefined`)[]\>

Defined in: [utils/reverseLookupBatch.ts:35](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/utils/reverseLookupBatch.ts#L35)

Performs reverse lookups for domain addresses.

## Parameters

### params

[`ReverseLookupBatchParams`](../interfaces/ReverseLookupBatchParams.md)

Reverse lookup parameters

## Returns

`Promise`\<(`string` \| `undefined`)[]\>

Human-readable domain names, or `undefined` when reverse account data is unavailable.

## Example

```ts
const domains = await reverseLookupBatch({ rpc, domainAddresses });
```
