---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / updateRecord

# Function: updateRecord()

> **updateRecord**(`domain`, `record`, `content`, `owner`, `payer`): `TransactionInstruction`

Defined in: [bindings/updateRecord.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/bindings/updateRecord.ts#L26)

Builds an instruction to update a record for a `.sns` domain or subdomain.

## Parameters

### domain

`string`

Full `.sns` domain or subdomain name

### record

[`Record`](../../Records/enumerations/Record.md)

Record type

### content

`string`

Record content

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
const instruction = updateRecord("example.sns", Record.Url, "https://example.com", owner, payer);
```
