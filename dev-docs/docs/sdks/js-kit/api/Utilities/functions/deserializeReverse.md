---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / deserializeReverse

# Function: deserializeReverse()

## Call Signature

> **deserializeReverse**(`params`): `string`

Defined in: [utils/deserializers/deserializeReverse.ts:35](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/deserializers/deserializeReverse.ts#L35)

Deserializes reverse account data.

The first four bytes encode the reverse name length.

### Parameters

#### params

[`DeserializeReverseParams`](../interfaces/DeserializeReverseParams.md)

Reverse deserialization parameters

### Returns

`string`

The deserialized string, or `undefined` if data is undefined.

### Example

```ts
const name = deserializeReverse({ data: reverseAccountData });
```

## Call Signature

> **deserializeReverse**(`params`): `undefined`

Defined in: [utils/deserializers/deserializeReverse.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/deserializers/deserializeReverse.ts#L40)

Deserializes reverse account data.

The first four bytes encode the reverse name length.

### Parameters

#### params

[`DeserializeReverseParams`](../interfaces/DeserializeReverseParams.md)

Reverse deserialization parameters

### Returns

`undefined`

The deserialized string, or `undefined` if data is undefined.

### Example

```ts
const name = deserializeReverse({ data: reverseAccountData });
```
