---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getAllSnsDomains

# Function: getAllSnsDomains()

> **getAllSnsDomains**(`params`): `Promise`\<[`GetAllSnsDomainsResult`](../interfaces/GetAllSnsDomainsResult.md)[]\>

Defined in: [domain/getAllSnsDomains.ts:54](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/domain/getAllSnsDomains.ts#L54)

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
