---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / reverseLookup

# Function: reverseLookup()

> **reverseLookup**(`connection`, `nameAccount`, `parent?`): `Promise`\<`string`\>

Defined in: [utils/reverseLookup.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/reverseLookup.ts#L20)

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
