---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / verifyRightOfAssociation

# Function: verifyRightOfAssociation()

> **verifyRightOfAssociation**(`connection`, `record`, `domain`, `verifier?`): `Promise`\<`boolean`\>

Defined in: [record/verifyRightOfAssociation.ts:35](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/verifyRightOfAssociation.ts#L35)

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

Full `.sns` domain name

### verifier?

`Buffer`\<`ArrayBufferLike`\>

Optional verifier. Defaults to the record content for self-signed
records and to the guardian pubkey otherwise. Required when neither applies.

## Returns

`Promise`\<`boolean`\>

Whether the record's Right of Association validation matches the verifier.

## Throws

[Errors.UnsupportedTldError](../../Errors/classes/UnsupportedTldError.md) when the domain lacks a `.sns` suffix;
[Errors.InvalidDomainError](../../Errors/classes/InvalidDomainError.md) when the `.sns` domain or subdomain is invalid.

## Example

```ts
const valid = await verifyRightOfAssociation(connection, Record.Url, "example.sns");
```
