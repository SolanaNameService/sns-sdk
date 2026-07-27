---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / DeserializeReverseParams

# Interface: DeserializeReverseParams

Defined in: [utils/deserializers/deserializeReverse.ts:13](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/deserializers/deserializeReverse.ts#L13)

Parameters for deserializing reverse account data.

## Example

```ts
const params: DeserializeReverseParams = { data: reverseAccountData };
```

## Properties

### data

> **data**: `ReadonlyUint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [utils/deserializers/deserializeReverse.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/deserializers/deserializeReverse.ts#L15)

Reverse account data.

***

### trimFirstNullByte?

> `optional` **trimFirstNullByte?**: `boolean`

Defined in: [utils/deserializers/deserializeReverse.ts:17](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/deserializers/deserializeReverse.ts#L17)

Whether to remove a subdomain's leading null byte. Defaults to false.
