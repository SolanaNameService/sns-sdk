---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / createVerifiedTwitterRegistry

# Function: createVerifiedTwitterRegistry()

> **createVerifiedTwitterRegistry**(`connection`, `twitterHandle`, `verifiedPubkey`, `space`, `payerKey`): `Promise`\<`TransactionInstruction`[]\>

Defined in: [twitter/createVerifiedTwitterRegistry.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/twitter/createVerifiedTwitterRegistry.ts#L37)

Builds instructions to create a verified Twitter handle registry and its reverse registry.

The authority, payer, and verified public key must sign the resulting instructions.

## Parameters

### connection

`Connection`

Solana RPC connection used to calculate rent-exemption costs.

### twitterHandle

`string`

Twitter handle to verify and register.

### verifiedPubkey

`PublicKey`

Public key associated with the verified handle.

### space

`number`

Number of bytes available in the user-facing registry.

### payerKey

`PublicKey`

Signer that funds both registry accounts.

## Returns

`Promise`\<`TransactionInstruction`[]\>

Instructions that create the handle and reverse registries.

## Example

```ts
const instructions = await createVerifiedTwitterRegistry(connection, "bonfida", owner, 128, payer);
```
