---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / setPrimaryDomain

# Function: setPrimaryDomain()

> **setPrimaryDomain**(`connection`, `nameAccount`, `owner`): `Promise`\<`TransactionInstruction`\>

Defined in: [bindings/setPrimaryDomain.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/bindings/setPrimaryDomain.ts#L24)

Builds an instruction to set a domain as the owner's primary domain.

This derives the owner's primary-domain account, detects whether the provided
name account is a subdomain, and includes the parent name account when
required by the primary-domain program.

## Parameters

### connection

`Connection`

Solana RPC connection

### nameAccount

`PublicKey`

Name account to set as primary

### owner

`PublicKey`

Owner of the name account

## Returns

`Promise`\<`TransactionInstruction`\>

Transaction instruction.

## Example

```ts
const instruction = await setPrimaryDomain(connection, nameAccount, owner);
```
