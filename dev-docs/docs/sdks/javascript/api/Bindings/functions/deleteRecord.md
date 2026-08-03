---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / deleteRecord

# Function: deleteRecord()

> **deleteRecord**(`domain`, `record`, `owner`, `payer`): `TransactionInstruction`

Defined in: [bindings/deleteRecord.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/bindings/deleteRecord.ts#L27)

Builds an instruction to delete a record for a `.sns` domain or subdomain.

## Parameters

### domain

`string`

Full `.sns` domain or subdomain name

### record

[`Record`](../../Records/enumerations/Record.md)

Record type

### owner

`PublicKey`

Current owner of the domain

### payer

`PublicKey`

Fee payer for the instruction

## Returns

`TransactionInstruction`

Transaction instruction.

## Example

```ts
const instruction = deleteRecord("example.sns", Record.Url, owner, payer);
```
