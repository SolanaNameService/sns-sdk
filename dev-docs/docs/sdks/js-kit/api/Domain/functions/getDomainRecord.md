---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getDomainRecord

# Function: getDomainRecord()

> **getDomainRecord**(`params`): `Promise`\<[`GetDomainRecordResult`](../interfaces/GetDomainRecordResult.md)\>

Defined in: [domain/getDomainRecord.ts:114](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L114)

Retrieves a V2 record under a domain, verifies it, and optionally decodes its content.

## Parameters

### params

[`GetDomainRecordParams`](../interfaces/GetDomainRecordParams.md)

Record retrieval parameters

## Returns

`Promise`\<[`GetDomainRecordResult`](../interfaces/GetDomainRecordResult.md)\>

The V2 record state, its verification result, and optional decoded content

## Example

```ts
const result = await getDomainRecord({ rpc, domain: "example.sns", record: Record.Url });
```
