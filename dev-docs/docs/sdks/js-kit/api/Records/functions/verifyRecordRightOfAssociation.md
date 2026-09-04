---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / verifyRecordRightOfAssociation

# Function: verifyRecordRightOfAssociation()

> **verifyRecordRightOfAssociation**(`rpc`, `domain`, `record`, `verifier?`): `Promise`\<`boolean`\>

Defined in: [record/verifyRecordRightOfAssociation.ts:106](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/record/verifyRecordRightOfAssociation.ts#L106)

Verifies a record's Right of Association validation.

## Parameters

### rpc

`Rpc`\<`GetAccountInfoApi` & `GetTokenLargestAccountsApi`\>

RPC client implementing account and token-largest-account APIs

### domain

`string`

Full `.sns` domain name

### record

[`Record`](../../Types/enumerations/Record.md)

Record type to verify

### verifier?

`ReadonlyUint8Array`\<`ArrayBufferLike`\>

Optional verifier for the record. If omitted, a default verifier is derived

## Returns

`Promise`\<`boolean`\>

True if the association is valid, false otherwise.

## Throws

MissingVerifierError If no verifier is specified and no default verifier is found.

## Example

```ts
const valid = await verifyRecordRightOfAssociation(rpc, "example.sns", Record.Url);
```
