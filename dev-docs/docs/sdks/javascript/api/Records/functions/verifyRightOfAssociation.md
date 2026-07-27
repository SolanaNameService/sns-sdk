---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / verifyRightOfAssociation

# Function: verifyRightOfAssociation()

> **verifyRightOfAssociation**(`connection`, `record`, `domain`, `verifier?`): `Promise`\<`boolean`\>

Defined in: [record/verifyRightOfAssociation.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/record/verifyRightOfAssociation.ts#L28)

Verifies a record's Right of Association validation.

This does not verify staleness; callers must verify staleness separately.

## Parameters

### connection

`Connection`

Solana RPC connection

### record

[`Record`](../enumerations/Record.md)

Record type

### domain

`string`

Full `.sns` or `.sol` domain name

### verifier?

`Buffer`\<`ArrayBufferLike`\>

Optional verifier. Required when no guardian exists for the record

## Returns

`Promise`\<`boolean`\>

Whether the record's Right of Association validation matches the verifier.

## Example

```ts
const valid = await verifyRightOfAssociation(connection, Record.Url, "example.sns");
```
