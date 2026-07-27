---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / createReverse

# Function: createReverse()

> **createReverse**(`nameAccount`, `name`, `feePayer`, `parentName?`, `parentNameOwner?`): `Promise`\<`TransactionInstruction`[]\>

Defined in: [bindings/createReverse.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/bindings/createReverse.ts#L34)

Builds an instruction to create an SNS reverse lookup account.

This is a low-level SNS registrar helper: it creates reverse lookup accounts
for SNS domains only. It is not suffix-aware and does not derive `nameAccount`
from a `.sns` domain string. The `name` argument is stored as provided and is
not validated, so callers must ensure it matches the supplied SNS
`nameAccount`. For subdomains, pass the parent name account and parent owner
so the reverse lookup is derived in the parent namespace.

## Parameters

### nameAccount

`PublicKey`

The pre-derived SNS name account the reverse lookup points to

### name

`string`

The raw reverse name to store without a TLD suffix

### feePayer

`PublicKey`

Fee payer for the instruction

### parentName?

`PublicKey`

Optional parent name account, required for subdomain reverse lookups

### parentNameOwner?

`PublicKey`

Optional parent name owner, required when `parentName` is provided

## Returns

`Promise`\<`TransactionInstruction`[]\>

Transaction instructions.

## Example

```ts
const instructions = await createReverse(nameAccount, "example", payer);
```
