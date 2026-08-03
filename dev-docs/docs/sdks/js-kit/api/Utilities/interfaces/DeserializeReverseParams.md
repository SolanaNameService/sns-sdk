---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / DeserializeReverseParams

# Interface: DeserializeReverseParams

Defined in: [utils/deserializers/deserializeReverse.ts:13](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/utils/deserializers/deserializeReverse.ts#L13)

Parameters for deserializing reverse account data.

## Example

```ts
const params: DeserializeReverseParams = { data: reverseAccountData };
```

## Properties

### data

> **data**: `ReadonlyUint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [utils/deserializers/deserializeReverse.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/utils/deserializers/deserializeReverse.ts#L15)

Reverse account data.

***

### trimFirstNullByte?

> `optional` **trimFirstNullByte?**: `boolean`

Defined in: [utils/deserializers/deserializeReverse.ts:17](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/utils/deserializers/deserializeReverse.ts#L17)

Whether to remove a subdomain's leading null byte. Defaults to false.
