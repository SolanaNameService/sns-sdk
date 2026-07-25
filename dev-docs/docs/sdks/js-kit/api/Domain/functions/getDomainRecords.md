---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getDomainRecords

# Function: getDomainRecords()

> **getDomainRecords**\<`T`, `U`\>(`params`): `Promise`\<([`GetDomainRecordsResult`](../interfaces/GetDomainRecordsResult.md) \| `undefined`)[]\>

Defined in: [domain/getDomainRecords.ts:128](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L128)

Retrieves V2 records under a domain, verifies them, and optionally decodes their content.

## Type Parameters

### T

`T` *extends* [`Record`](../../Types/enumerations/Record.md)[]

### U

`U` *extends* \{ \[K in string \| number \| symbol\]: ReadonlyUint8Array\<ArrayBufferLike\> \| undefined \}

## Parameters

### params

[`GetDomainRecordsParams`](../interfaces/GetDomainRecordsParams.md)\<`T`, `U`\>

Record retrieval parameters

## Returns

`Promise`\<([`GetDomainRecordsResult`](../interfaces/GetDomainRecordsResult.md) \| `undefined`)[]\>

Results aligned with `records`; missing V2 record accounts produce `undefined`

## Example

```ts
const results = await getDomainRecords({ rpc, domain: "example.sns", records: [Record.Url] });
```
