---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / \_verifyRoaSync

# Function: \_verifyRoaSync()

> **\_verifyRoaSync**(`params`): `boolean`

Defined in: [record/verifyRecordRightOfAssociation.ts:71](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/record/verifyRecordRightOfAssociation.ts#L71)

Internal helper that verifies a record's Right of Association validation.

Ethereum/secp256k1 validation is used for EVM RoA records; Solana validation
is used otherwise.

## Parameters

### params

Right of Association verification parameters

#### record

[`Record`](../../Types/enumerations/Record.md)

Record type to verify

#### state

[`RecordState`](../../States/classes/RecordState.md)

Record state

#### verifier

`ReadonlyUint8Array`

Verifier for the record

## Returns

`boolean`

True if the association is valid, false otherwise.

## Example

```ts
const valid = _verifyRoaSync({ record: Record.Url, state, verifier });
```
