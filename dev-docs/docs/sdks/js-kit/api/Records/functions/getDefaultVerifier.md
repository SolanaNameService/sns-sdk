---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / \_getDefaultVerifier

# Function: \_getDefaultVerifier()

> **\_getDefaultVerifier**(`params`): `Uint8Array`\<`ArrayBufferLike`\> \| `ReadonlyUint8Array`\<`ArrayBuffer`\> \| `undefined`

Defined in: [record/verifyRecordRightOfAssociation.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/record/verifyRecordRightOfAssociation.ts#L36)

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
