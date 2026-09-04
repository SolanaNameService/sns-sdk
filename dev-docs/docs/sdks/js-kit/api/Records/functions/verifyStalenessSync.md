---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / \_verifyStalenessSync

# Function: \_verifyStalenessSync()

> **\_verifyStalenessSync**(`params`): `boolean`

Defined in: [record/verifyRecordStaleness.ts:30](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/record/verifyRecordStaleness.ts#L30)

Internal helper that verifies a record's staleness validation.

## Parameters

### params

Staleness verification parameters

#### domainOwner

`Address`

Current owner of the domain

#### state

[`RecordState`](../../States/classes/RecordState.md)

Record state to verify

## Returns

`boolean`

True if the record's staleness validation passes, false otherwise.

## Example

```ts
const valid = _verifyStalenessSync({ domainOwner, state });
```
