---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getDomainRecord

# Function: getDomainRecord()

> **getDomainRecord**(`params`): `Promise`\<[`GetDomainRecordResult`](../interfaces/GetDomainRecordResult.md)\>

Defined in: [domain/getDomainRecord.ts:118](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecord.ts#L118)

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
