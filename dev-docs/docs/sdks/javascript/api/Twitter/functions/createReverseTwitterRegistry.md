---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / createReverseTwitterRegistry

# Function: createReverseTwitterRegistry()

> **createReverseTwitterRegistry**(`connection`, `twitterHandle`, `twitterRegistryKey`, `verifiedPubkey`, `payerKey`): `Promise`\<`TransactionInstruction`[]\>

Defined in: [twitter/createReverseTwitterRegistry.ts:45](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/twitter/createReverseTwitterRegistry.ts#L45)

Builds instructions to create the reverse registry for a verified Twitter handle.

The Twitter verification authority must authorize the resulting registry writes.

## Parameters

### connection

`Connection`

Solana RPC connection used to calculate rent-exemption costs.

### twitterHandle

`string`

Verified Twitter handle for the reverse registry.

### twitterRegistryKey

`PublicKey`

User-facing registry address for the handle.

### verifiedPubkey

`PublicKey`

Verified public key associated with the handle.

### payerKey

`PublicKey`

Signer that funds the reverse registry account.

## Returns

`Promise`\<`TransactionInstruction`[]\>

Instructions that create and populate the reverse registry.

## Example

```ts
const instructions = await createReverseTwitterRegistry(
  connection,
  "bonfida",
  registry,
  owner,
  payer,
);
```
