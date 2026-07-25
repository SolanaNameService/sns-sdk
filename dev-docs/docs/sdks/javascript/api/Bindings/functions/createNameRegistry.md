---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / createNameRegistry

# Function: createNameRegistry()

> **createNameRegistry**(`connection`, `name`, `space`, `payerKey`, `nameOwner`, `lamports?`, `nameClass?`, `parentName?`): `Promise`\<`TransactionInstruction`\>

Defined in: [bindings/createNameRegistry.ts:33](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/bindings/createNameRegistry.ts#L33)

Builds an instruction to create a name account with the given rent budget, space, owner, and class.

## Parameters

### connection

`Connection`

Solana RPC connection

### name

`string`

Name of the new account

### space

`number`

Space in bytes allocated to the account

### payerKey

`PublicKey`

Account paying for allocation

### nameOwner

`PublicKey`

Owner of the new name account

### lamports?

`number`

Lamports to fund the account. Defaults to the rent-exempt minimum

### nameClass?

`PublicKey`

Optional class of the new name account

### parentName?

`PublicKey`

Optional parent name account. Its owner must sign when provided

## Returns

`Promise`\<`TransactionInstruction`\>

Transaction instruction.

## Example

```ts
const instruction = await createNameRegistry(connection, "example", 1000, payer, owner);
```
