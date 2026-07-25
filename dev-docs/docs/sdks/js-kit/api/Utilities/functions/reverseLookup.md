---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / reverseLookup

# Function: reverseLookup()

> **reverseLookup**(`params`): `Promise`\<`string`\>

Defined in: [utils/reverseLookup.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/utils/reverseLookup.ts#L40)

Performs a reverse lookup for a domain address.

## Parameters

### params

[`ReverseLookupParams`](../interfaces/ReverseLookupParams.md)

Reverse lookup parameters

## Returns

`Promise`\<`string`\>

Human-readable domain name.

## Throws

NoAccountDataError If the registry data is empty.

## Example

```ts
const name = await reverseLookup({ rpc, domainAddress });
```
