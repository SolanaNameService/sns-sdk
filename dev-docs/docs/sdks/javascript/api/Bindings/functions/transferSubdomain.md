---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / transferSubdomain

# Function: transferSubdomain()

> **transferSubdomain**(`connection`, `subdomain`, `newOwner`, `isParentOwnerSigner?`, `owner?`): `Promise`\<`TransactionInstruction`\>

Defined in: [bindings/transferSubdomain.ts:23](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/bindings/transferSubdomain.ts#L23)

Builds an instruction to transfer a `.sns` subdomain.

## Parameters

### connection

`Connection`

Solana RPC connection

### subdomain

`string`

Full `.sns` subdomain name

### newOwner

`PublicKey`

New owner of the subdomain

### isParentOwnerSigner?

`boolean`

Whether the parent name owner signs the transfer

### owner?

`PublicKey`

Current owner of the subdomain. Resolved automatically when omitted

## Returns

`Promise`\<`TransactionInstruction`\>

Transaction instruction.

## Example

```ts
const instruction = await transferSubdomain(connection, "sub.example.sns", newOwner);
```
