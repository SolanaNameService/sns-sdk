---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / verifyStaleness

# Function: verifyStaleness()

> **verifyStaleness**(`connection`, `record`, `domain`): `Promise`\<`boolean`\>

Defined in: [record/verifyStaleness.ts:26](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/verifyStaleness.ts#L26)

Verifies a record's staleness validation.

## Parameters

### connection

`Connection`

Solana RPC connection

### record

[`Record`](../enumerations/Record.md)

Record type

### domain

`string`

Full `.sns` domain name

## Returns

`Promise`\<`boolean`\>

Whether the record's staleness validation matches the current owner.

## Throws

[Errors.UnsupportedTldError](../../Errors/classes/UnsupportedTldError.md) when the domain lacks a `.sns` suffix;
[Errors.InvalidDomainError](../../Errors/classes/InvalidDomainError.md) when the `.sns` domain or subdomain is invalid.

## Example

```ts
const valid = await verifyStaleness(connection, Record.Url, "example.sns");
```
