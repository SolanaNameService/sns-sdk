---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / getReverseAddress

# Function: getReverseAddress()

> **getReverseAddress**(`domain`): `Promise`\<`Address`\>

Defined in: [utils/getReverseAddress.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/utils/getReverseAddress.ts#L15)

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
