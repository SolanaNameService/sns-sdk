---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / \_getDefaultVerifier

# Function: \_getDefaultVerifier()

> **\_getDefaultVerifier**(`params`): `Uint8Array`\<`ArrayBufferLike`\> \| `ReadonlyUint8Array`\<`ArrayBuffer`\> \| `undefined`

Defined in: [record/verifyRecordRightOfAssociation.ts:35](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/record/verifyRecordRightOfAssociation.ts#L35)

Internal helper that derives the default verifier for a record state.

## Parameters

### params

Default verifier parameters

#### record

[`Record`](../../Types/enumerations/Record.md)

Record type

#### state

[`RecordState`](../../States/classes/RecordState.md)

Record state

## Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `ReadonlyUint8Array`\<`ArrayBuffer`\> \| `undefined`

The default verifier, or `undefined` when no verifier is found.

## Example

```ts
const verifier = _getDefaultVerifier({ record: Record.Url, state });
```
