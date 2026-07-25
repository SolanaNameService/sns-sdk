---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / deleteNameRegistry

# Function: deleteNameRegistry()

> **deleteNameRegistry**(`connection`, `name`, `refundTargetKey`, `nameClass?`, `nameParent?`): `Promise`\<`TransactionInstruction`\>

Defined in: [bindings/deleteNameRegistry.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/bindings/deleteNameRegistry.ts#L23)

Builds an instruction to delete a name account and transfer reclaimed rent.

## Parameters

### connection

`Connection`

Solana RPC connection

### name

`string`

Name of the name account

### refundTargetKey

`PublicKey`

Refund destination address

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
const instruction = await deleteNameRegistry(connection, "example", refundTarget);
```
