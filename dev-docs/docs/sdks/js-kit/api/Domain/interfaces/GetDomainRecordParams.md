---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordParams

# Interface: GetDomainRecordParams

Defined in: [domain/getDomainRecord.ts:49](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecord.ts#L49)

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

Defined in: [domain/getDomainRecord.ts:58](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecord.ts#L58)

Full domain name.

***

### options?

> `optional` **options?**: [`GetDomainRecordOptions`](GetDomainRecordOptions.md)

Defined in: [domain/getDomainRecord.ts:62](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecord.ts#L62)

Record retrieval options.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [domain/getDomainRecord.ts:60](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecord.ts#L60)

Record type to retrieve.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetMultipleAccountsApi` & `GetTokenLargestAccountsApi` & `GetSlotApi`\>

Defined in: [domain/getDomainRecord.ts:51](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecord.ts#L51)

RPC client.
