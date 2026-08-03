---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / createRecord

# Function: createRecord()

> **createRecord**(`domain`, `record`, `content`, `owner`, `payer`): `TransactionInstruction`

Defined in: [bindings/createRecord.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/bindings/createRecord.ts#L26)

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
