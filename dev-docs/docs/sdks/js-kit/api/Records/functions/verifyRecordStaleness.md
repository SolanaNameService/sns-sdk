---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / verifyRecordStaleness

# Function: verifyRecordStaleness()

> **verifyRecordStaleness**(`params`): `Promise`\<`boolean`\>

Defined in: [record/verifyRecordStaleness.ts:81](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/record/verifyRecordStaleness.ts#L81)

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
