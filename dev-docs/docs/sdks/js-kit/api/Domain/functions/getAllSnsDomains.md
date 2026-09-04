---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getAllSnsDomains

# Function: getAllSnsDomains()

> **getAllSnsDomains**(`params`): `Promise`\<[`GetAllSnsDomainsResult`](../interfaces/GetAllSnsDomainsResult.md)[]\>

Defined in: [domain/getAllSnsDomains.ts:54](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getAllSnsDomains.ts#L54)

Retrieves all top-level SNS domain accounts.

## Parameters

### params

[`GetAllSnsDomainsParams`](../interfaces/GetAllSnsDomainsParams.md)

Domain retrieval parameters

## Returns

`Promise`\<[`GetAllSnsDomainsResult`](../interfaces/GetAllSnsDomainsResult.md)[]\>

Domain account addresses and owners.

## Example

```ts
const domains = await getAllSnsDomains({ rpc });
```
