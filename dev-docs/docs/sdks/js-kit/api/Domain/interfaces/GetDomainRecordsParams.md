---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordsParams

# Interface: GetDomainRecordsParams\<T, U\>

Defined in: [domain/getDomainRecords.ts:55](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L55)

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

Defined in: [domain/getDomainRecords.ts:64](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L64)

Full `.sns` domain name.

***

### options?

> `optional` **options?**: [`GetDomainRecordsOptions`](GetDomainRecordsOptions.md)\<`T`, `U`\>

Defined in: [domain/getDomainRecords.ts:68](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L68)

Record retrieval options.

***

### records

> **records**: \[`...T[]`\]

Defined in: [domain/getDomainRecords.ts:66](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L66)

Record types to retrieve.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetMultipleAccountsApi` & `GetTokenLargestAccountsApi`\>

Defined in: [domain/getDomainRecords.ts:60](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L60)

RPC client.
