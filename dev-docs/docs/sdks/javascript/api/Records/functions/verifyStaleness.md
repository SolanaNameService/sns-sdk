---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / verifyStaleness

# Function: verifyStaleness()

> **verifyStaleness**(`connection`, `record`, `domain`): `Promise`\<`boolean`\>

Defined in: [record/verifyStaleness.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/record/verifyStaleness.ts#L24)

Verifies a record's staleness validation.

## Parameters

### connection

`Connection`

Solana RPC connection

### record

[`Record`](../enumerations/Record.md)

Record type

### domain

`string`

Full `.sns` or `.sol` domain name

## Returns

`Promise`\<`boolean`\>

Whether the record's staleness validation matches the current owner.

## Example

```ts
const valid = await verifyStaleness(connection, Record.Url, "example.sns");
```
