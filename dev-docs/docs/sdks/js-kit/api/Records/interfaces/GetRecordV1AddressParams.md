---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / GetRecordV1AddressParams

# Interface: GetRecordV1AddressParams

Defined in: [record/getRecordV1Address.ts:12](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/record/getRecordV1Address.ts#L12)

Parameters for deriving a V1 record address.

## Example

```ts
const params: GetRecordV1AddressParams = { domain: "example", record: Record.Url };
```

## Properties

### domain

> **domain**: `string`

Defined in: [record/getRecordV1Address.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/record/getRecordV1Address.ts#L14)

TLD-less domain name.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [record/getRecordV1Address.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/record/getRecordV1Address.ts#L16)

Record type.
