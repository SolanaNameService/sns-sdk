---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / GetRecordV2AddressParams

# Interface: GetRecordV2AddressParams

Defined in: [record/getRecordV2Address.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/record/getRecordV2Address.ts#L16)

Parameters for deriving a V2 record address.

## Example

```ts
const params: GetRecordV2AddressParams = { domain: "example", record: Record.Url };
```

## Properties

### domain

> **domain**: `string`

Defined in: [record/getRecordV2Address.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/record/getRecordV2Address.ts#L18)

TLD-less domain name.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [record/getRecordV2Address.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/record/getRecordV2Address.ts#L20)

Record type.
