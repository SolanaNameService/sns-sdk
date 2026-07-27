---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / getReverseAddress

# Function: getReverseAddress()

> **getReverseAddress**(`domain`): `Promise`\<`Address`\>

Defined in: [utils/getReverseAddress.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/getReverseAddress.ts#L15)

Derives the reverse lookup account address for a TLD-trimmed SNS domain.

## Parameters

### domain

`string`

TLD-trimmed SNS domain name

## Returns

`Promise`\<`Address`\>

The reverse lookup account address.

## Example

```ts
const address = await getReverseAddress("example");
```
