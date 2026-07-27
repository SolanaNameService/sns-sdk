---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / getRecordV1Key

# Function: getRecordV1Key()

> **getRecordV1Key**(`domain`, `record`): `PublicKey`

Defined in: [record/getRecordV1Key.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/record/getRecordV1Key.ts#L21)

Derives the legacy V1 record account key.

This is kept for legacy resolution paths such as SOL record fallback in
`resolve`. New record reads/writes should use the high-level record APIs.
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
const key = getRecordV1Key("example", Record.SOL);
```
