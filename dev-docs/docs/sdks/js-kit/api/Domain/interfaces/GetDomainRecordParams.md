---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordParams

# Interface: GetDomainRecordParams

Defined in: [domain/getDomainRecord.ts:48](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L48)

Parameters for retrieving a domain record.

## Example

```ts
const params: GetDomainRecordParams = {
  rpc,
  domain: "example.sns",
  record: Record.Url,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [domain/getDomainRecord.ts:54](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L54)

Full `.sns` domain name.

***

### options?

> `optional` **options?**: [`GetDomainRecordOptions`](GetDomainRecordOptions.md)

Defined in: [domain/getDomainRecord.ts:58](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L58)

Record retrieval options.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [domain/getDomainRecord.ts:56](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L56)

Record type to retrieve.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetMultipleAccountsApi` & `GetTokenLargestAccountsApi`\>

Defined in: [domain/getDomainRecord.ts:50](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L50)

RPC client.
