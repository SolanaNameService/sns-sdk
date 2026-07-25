---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / getRecordV2Address

# Function: getRecordV2Address()

> **getRecordV2Address**(`params`): `Promise`\<`Address`\>

Defined in: [record/getRecordV2Address.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/record/getRecordV2Address.ts#L36)

Derives the address of a V2 record account.

## Parameters

### params

[`GetRecordV2AddressParams`](../interfaces/GetRecordV2AddressParams.md)

Record address derivation parameters

## Returns

`Promise`\<`Address`\>

The derived V2 record account address.

## Example

```ts
const address = await getRecordV2Address({ domain: "example", record: Record.Url });
```
