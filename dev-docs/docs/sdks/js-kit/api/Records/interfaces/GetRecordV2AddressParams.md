---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / GetRecordV2AddressParams

# Interface: GetRecordV2AddressParams

Defined in: [record/getRecordV2Address.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/record/getRecordV2Address.ts#L16)

Parameters for deriving a V2 record address.

## Example

```ts
const params: GetRecordV2AddressParams = { domain: "example", record: Record.Url };
```

## Properties

### domain

> **domain**: `string`

Defined in: [record/getRecordV2Address.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/record/getRecordV2Address.ts#L18)

TLD-less domain name.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [record/getRecordV2Address.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/record/getRecordV2Address.ts#L20)

Record type.
