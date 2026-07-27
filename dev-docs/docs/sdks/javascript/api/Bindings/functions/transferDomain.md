---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / transferDomain

# Function: transferDomain()

> **transferDomain**(`connection`, `domain`, `newOwner`): `Promise`\<`TransactionInstruction`\>

Defined in: [bindings/transferDomain.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/bindings/transferDomain.ts#L23)

Builds an instruction to transfer a top-level `.sns` domain.

## Parameters

### connection

`Connection`

Solana RPC connection

### domain

`string`

Full `.sns` domain name

### newOwner

`PublicKey`

New owner of the domain

## Returns

`Promise`\<`TransactionInstruction`\>

Transaction instruction.

## Example

```ts
const instruction = await transferDomain(connection, "example.sns", newOwner);
```
