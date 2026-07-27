---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / createSubdomain

# Function: createSubdomain()

> **createSubdomain**(`connection`, `subdomain`, `owner`, `space?`, `feePayer?`): `Promise`\<`TransactionInstruction`[]\>

Defined in: [bindings/createSubdomain.ts:25](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/bindings/createSubdomain.ts#L25)

Builds the instructions to create a `.sns` subdomain.

## Parameters

### connection

`Connection`

Solana RPC connection

### subdomain

`string`

Full `.sns` subdomain name

### owner

`PublicKey`

Owner of the parent domain creating the subdomain

### space?

`number` = `2_000`

Space to allocate to the subdomain. Defaults to 2 kB

### feePayer?

`PublicKey`

Optional fee payer. Defaults to `owner`

## Returns

`Promise`\<`TransactionInstruction`[]\>

Transaction instructions.

## Example

```ts
const instructions = await createSubdomain(connection, "sub.example.sns", owner);
```
