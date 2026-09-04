---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getAllSolDomains

# Function: getAllSolDomains()

> **getAllSolDomains**(`params`): `Promise`\<[`GetAllSolDomainsResult`](../interfaces/GetAllSolDomainsResult.md)[]\>

Defined in: [domain/getAllSolDomains.ts:62](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getAllSolDomains.ts#L62)

Retrieves all registered top-level `.sol` SRS records, including expired
records.

The returned owner is the raw SRS owner field. It is a wallet address for a
directly owned record and a Token-2022 mint for a tokenized record.

## Parameters

### params

[`GetAllSolDomainsParams`](../interfaces/GetAllSolDomainsParams.md)

Domain retrieval parameters

## Returns

`Promise`\<[`GetAllSolDomainsResult`](../interfaces/GetAllSolDomainsResult.md)[]\>

All top-level SRS records with their addresses and raw owners, including expired records.

## Example

```ts
const domains = await getAllSolDomains({ rpc });
```
