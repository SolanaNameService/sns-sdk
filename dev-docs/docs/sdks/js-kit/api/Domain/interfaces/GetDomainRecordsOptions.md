---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordsOptions

# Interface: GetDomainRecordsOptions\<T, U\>

Defined in: [domain/getDomainRecords.ts:33](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L33)

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

Defined in: [domain/getDomainRecords.ts:38](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L38)

Whether to decode record content.

***

### verifiers?

> `optional` **verifiers?**: \[`...U[]`\]

Defined in: [domain/getDomainRecords.ts:40](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecords.ts#L40)

Right of Association verifiers by record position.
