---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / createRecord

# Function: createRecord()

> **createRecord**(`domain`, `record`, `content`, `owner`, `payer`): `TransactionInstruction`

Defined in: [bindings/createRecord.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/bindings/createRecord.ts#L26)

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
