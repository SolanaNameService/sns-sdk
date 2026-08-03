---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getAllSnsDomains

# Function: getAllSnsDomains()

> **getAllSnsDomains**(`params`): `Promise`\<[`GetAllSnsDomainsResult`](../interfaces/GetAllSnsDomainsResult.md)[]\>

Defined in: [domain/getAllSnsDomains.ts:54](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getAllSnsDomains.ts#L54)

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
