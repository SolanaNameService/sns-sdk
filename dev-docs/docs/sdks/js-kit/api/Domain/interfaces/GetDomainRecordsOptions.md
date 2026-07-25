---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordsOptions

# Interface: GetDomainRecordsOptions\<T, U\>

Defined in: [domain/getDomainRecords.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L34)

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

Defined in: [domain/getDomainRecords.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L39)

Whether to decode record content.

***

### verifiers?

> `optional` **verifiers?**: \[`...U[]`\]

Defined in: [domain/getDomainRecords.ts:41](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainRecords.ts#L41)

Right of Association verifiers by record position.
