---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / getRecordV2Key

# Function: getRecordV2Key()

> **getRecordV2Key**(`domain`, `record`): `PublicKey`

Defined in: [record/getRecordV2Key.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/record/getRecordV2Key.ts#L28)

Derives the V2 record account key.

Most consumers should use the high-level record APIs (`getRecord`,
`createRecord`, `updateRecord`, etc.). This helper is exposed for callers
that need deterministic account derivation.

The caller must trim the TLD suffix before calling this function. For
example, pass `"example"` instead of `"example.sns"`.

## Parameters

### domain

`string`

Domain name with its TLD suffix trimmed

### record

[`Record`](../enumerations/Record.md)

Record type

## Returns

`PublicKey`

Record account public key

## Example

```ts
const key = getRecordV2Key("example", Record.Url);
```
