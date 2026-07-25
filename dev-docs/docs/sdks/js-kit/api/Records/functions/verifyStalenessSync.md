---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / \_verifyStalenessSync

# Function: \_verifyStalenessSync()

> **\_verifyStalenessSync**(`params`): `boolean`

Defined in: [record/verifyRecordStaleness.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/record/verifyRecordStaleness.ts#L31)

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
