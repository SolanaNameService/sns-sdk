---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / deleteRecord

# Function: deleteRecord()

> **deleteRecord**(`domain`, `record`, `owner`, `payer`): `TransactionInstruction`

Defined in: [bindings/deleteRecord.ts:27](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/bindings/deleteRecord.ts#L27)

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
