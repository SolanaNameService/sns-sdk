---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / reverseLookup

# Function: reverseLookup()

> **reverseLookup**(`connection`, `nameAccount`, `parent?`): `Promise`\<`string`\>

Defined in: [utils/reverseLookup.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/utils/reverseLookup.ts#L20)

Performs a reverse lookup for a domain account.

## Parameters

### connection

`Connection`

Solana RPC connection

### nameAccount

`PublicKey`

Domain account public key to reverse look up

### parent?

`PublicKey`

Optional parent name account for subdomain reverse lookups

## Returns

`Promise`\<`string`\>

Human-readable domain name.

## Example

```ts
const name = await reverseLookup(connection, nameAccount);
```
