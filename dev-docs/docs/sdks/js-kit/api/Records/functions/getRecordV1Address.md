---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / getRecordV1Address

# Function: getRecordV1Address()

> **getRecordV1Address**(`params`): `Promise`\<`Address`\>

Defined in: [record/getRecordV1Address.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/record/getRecordV1Address.ts#L34)

Derives the address of a V1 record account.

The V1 account is derived by prefixing the record label to the domain name.

## Parameters

### params

[`GetRecordV1AddressParams`](../interfaces/GetRecordV1AddressParams.md)

Record address derivation parameters

## Returns

`Promise`\<`Address`\>

The derived V1 record account address.

## Example

```ts
const address = await getRecordV1Address({ domain: "example", record: Record.Url });
```
