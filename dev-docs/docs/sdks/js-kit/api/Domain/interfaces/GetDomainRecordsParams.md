---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordsParams

# Interface: GetDomainRecordsParams\<T, U\>

Defined in: [domain/getDomainRecords.ts:56](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L56)

Parameters for retrieving domain records.

## Example

```ts
const params: GetDomainRecordsParams<[Record.Url], [undefined]> = {
  rpc,
  domain: "example.sns",
  records: [Record.Url],
};
```

## Type Parameters

### T

`T` *extends* [`Record`](../../Types/enumerations/Record.md)[]

### U

`U` *extends* \{ \[K in keyof T\]: ReadonlyUint8Array \| undefined \}

## Properties

### domain

> **domain**: `string`

Defined in: [domain/getDomainRecords.ts:68](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L68)

Full domain name.

***

### options?

> `optional` **options?**: [`GetDomainRecordsOptions`](GetDomainRecordsOptions.md)\<`T`, `U`\>

Defined in: [domain/getDomainRecords.ts:72](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L72)

Record retrieval options.

***

### records

> **records**: \[`...T[]`\]

Defined in: [domain/getDomainRecords.ts:70](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L70)

Record types to retrieve.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetMultipleAccountsApi` & `GetTokenLargestAccountsApi` & `GetSlotApi`\>

Defined in: [domain/getDomainRecords.ts:61](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L61)

RPC client.
