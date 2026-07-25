---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordsOptions

# Interface: GetDomainRecordsOptions\<T, U\>

Defined in: [domain/getDomainRecords.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainRecords.ts#L34)

Options for retrieving domain records.

## Example

```ts
const options: GetDomainRecordsOptions<[Record.Url], [undefined]> = {
  deserialize: true,
  verifiers: [undefined],
};
```

## Type Parameters

### T

`T` *extends* [`Record`](../../Types/enumerations/Record.md)[]

### U

`U` *extends* \{ \[K in keyof T\]: ReadonlyUint8Array \| undefined \}

## Properties

### deserialize?

> `optional` **deserialize?**: `boolean`

Defined in: [domain/getDomainRecords.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainRecords.ts#L39)

Whether to decode record content.

***

### verifiers?

> `optional` **verifiers?**: \[`...U[]`\]

Defined in: [domain/getDomainRecords.ts:41](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getDomainRecords.ts#L41)

Right of Association verifiers by record position.
