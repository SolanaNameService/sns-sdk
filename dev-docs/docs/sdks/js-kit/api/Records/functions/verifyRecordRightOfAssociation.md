---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Records](../index.md) / verifyRecordRightOfAssociation

# Function: verifyRecordRightOfAssociation()

> **verifyRecordRightOfAssociation**(`rpc`, `domain`, `record`, `verifier?`): `Promise`\<`boolean`\>

Defined in: [record/verifyRecordRightOfAssociation.ts:107](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/record/verifyRecordRightOfAssociation.ts#L107)

Verifies a record's Right of Association validation.

## Parameters

### rpc

`Rpc`\<`GetAccountInfoApi` & `GetTokenLargestAccountsApi` & `GetSlotApi`\>

RPC client implementing account and token-largest-account APIs

### domain

`string`

Full domain name including a `.sns` or `.sol` suffix

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
