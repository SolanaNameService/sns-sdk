---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / VerifyRecordStalenessParams

# Interface: VerifyRecordStalenessParams

Defined in: [record/verifyRecordStaleness.ts:58](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/record/verifyRecordStaleness.ts#L58)

Parameters for verifying record staleness.

## Example

```ts
const params: VerifyRecordStalenessParams = {
  rpc,
  domain: "example.sns",
  record: Record.Url,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [record/verifyRecordStaleness.ts:62](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/record/verifyRecordStaleness.ts#L62)

Full domain name.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [record/verifyRecordStaleness.ts:64](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/record/verifyRecordStaleness.ts#L64)

Record type.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetTokenLargestAccountsApi` & `GetSlotApi`\>

Defined in: [record/verifyRecordStaleness.ts:60](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/record/verifyRecordStaleness.ts#L60)

RPC client.
