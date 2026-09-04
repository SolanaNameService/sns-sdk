---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / createRecord

# Function: createRecord()

> **createRecord**(`domain`, `record`, `content`, `owner`, `payer`): `TransactionInstruction`

Defined in: [bindings/createRecord.ts:26](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/bindings/createRecord.ts#L26)

Builds an instruction to create a record for a `.sns` domain or subdomain.

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
const instruction = createRecord("example.sns", Record.Url, "https://example.com", owner, payer);
```
