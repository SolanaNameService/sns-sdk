---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / updateNameRegistry

# Function: updateNameRegistry()

> **updateNameRegistry**(`connection`, `name`, `offset`, `input_data`, `nameClass?`, `nameParent?`): `Promise`\<`TransactionInstruction`\>

Defined in: [bindings/updateNameRegistry.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/bindings/updateNameRegistry.ts#L26)

Builds an instruction to overwrite name registry data.

## Parameters

### connection

`Connection`

Solana RPC connection

### name

`string`

Name of the name registry to update

### offset

`number`

Offset where data should be written

### input\_data

`Buffer`

Data to write

### nameClass?

`PublicKey`

Optional class of the name account

### nameParent?

`PublicKey`

Optional parent name account

## Returns

`Promise`\<`TransactionInstruction`\>

Transaction instruction.

## Example

```ts
const instruction = await updateNameRegistry(connection, "example", 0, Buffer.from("data"));
```
