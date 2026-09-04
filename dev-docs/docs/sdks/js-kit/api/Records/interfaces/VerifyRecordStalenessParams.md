---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / VerifyRecordStalenessParams

# Interface: VerifyRecordStalenessParams

Defined in: [record/verifyRecordStaleness.ts:57](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/record/verifyRecordStaleness.ts#L57)

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

Defined in: [record/verifyRecordStaleness.ts:61](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/record/verifyRecordStaleness.ts#L61)

Full `.sns` domain name.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [record/verifyRecordStaleness.ts:63](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/record/verifyRecordStaleness.ts#L63)

Record type.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetTokenLargestAccountsApi`\>

Defined in: [record/verifyRecordStaleness.ts:59](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/record/verifyRecordStaleness.ts#L59)

RPC client.
