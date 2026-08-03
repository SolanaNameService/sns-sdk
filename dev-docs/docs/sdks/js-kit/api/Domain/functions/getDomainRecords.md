---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getDomainRecords

# Function: getDomainRecords()

> **getDomainRecords**\<`T`, `U`\>(`params`): `Promise`\<([`GetDomainRecordsResult`](../interfaces/GetDomainRecordsResult.md) \| `undefined`)[]\>

Defined in: [domain/getDomainRecords.ts:128](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getDomainRecords.ts#L128)

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
