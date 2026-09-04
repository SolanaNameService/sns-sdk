---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / verifyRecordStaleness

# Function: verifyRecordStaleness()

> **verifyRecordStaleness**(`params`): `Promise`\<`boolean`\>

Defined in: [record/verifyRecordStaleness.ts:80](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/record/verifyRecordStaleness.ts#L80)

Verifies a record's staleness validation.

## Parameters

### params

[`VerifyRecordStalenessParams`](../interfaces/VerifyRecordStalenessParams.md)

Staleness verification parameters

## Returns

`Promise`\<`boolean`\>

True if the record's staleness validation passes, false otherwise.

## Example

```ts
const valid = await verifyRecordStaleness({ rpc, domain: "example.sns", record: Record.Url });
```
