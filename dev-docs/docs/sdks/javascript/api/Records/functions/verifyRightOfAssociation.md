---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / verifyRightOfAssociation

# Function: verifyRightOfAssociation()

> **verifyRightOfAssociation**(`connection`, `record`, `domain`, `verifier?`): `Promise`\<`boolean`\>

Defined in: [record/verifyRightOfAssociation.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/record/verifyRightOfAssociation.ts#L34)

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

Optional verifier. Defaults to the record content for self-signed
records and to the guardian pubkey otherwise. Required when neither applies.

## Returns

`Promise`\<`boolean`\>

Whether the record's Right of Association validation matches the verifier.

## Example

```ts
const valid = await verifyRightOfAssociation(connection, Record.Url, "example.sns");
```
