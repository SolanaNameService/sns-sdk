---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / changeVerifiedPubkey

# Function: changeVerifiedPubkey()

> **changeVerifiedPubkey**(`connection`, `twitterHandle`, `currentVerifiedPubkey`, `newVerifiedPubkey`, `payerKey`): `Promise`\<`TransactionInstruction`[]\>

Defined in: [twitter/changeVerifiedPubkey.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/twitter/changeVerifiedPubkey.ts#L36)

Builds instructions to transfer a Twitter handle to a new verified public key.

The authority, current verified key, and payer must sign the resulting instructions.

## Parameters

### connection

`Connection`

Solana RPC connection used to calculate rent-exemption costs.

### twitterHandle

`string`

Verified Twitter handle to transfer.

### currentVerifiedPubkey

`PublicKey`

Current verified owner and required signer.

### newVerifiedPubkey

`PublicKey`

Public key that will become the verified owner.

### payerKey

`PublicKey`

Signer that funds creation of the new reverse registry.

## Returns

`Promise`\<`TransactionInstruction`[]\>

Instructions that transfer the handle and recreate its reverse registry.

## Example

```ts
const instructions = await changeVerifiedPubkey(
  connection,
  "bonfida",
  currentOwner,
  newOwner,
  payer,
);
```
