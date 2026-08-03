---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / changeTwitterRegistryData

# Function: changeTwitterRegistryData()

> **changeTwitterRegistryData**(`twitterHandle`, `verifiedPubkey`, `offset`, `input_data`): `Promise`\<`TransactionInstruction`[]\>

Defined in: [twitter/changeTwitterRegistryData.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/twitter/changeTwitterRegistryData.ts#L28)

Builds an instruction that overwrites bytes in a verified Twitter registry.

The verified public key must sign the resulting instruction.

## Parameters

### twitterHandle

`string`

Verified Twitter handle whose registry is updated.

### verifiedPubkey

`PublicKey`

Signer that owns the verified registry.

### offset

`number`

Byte offset at which to write the data.

### input\_data

`Buffer`

Bytes to write into the registry data.

## Returns

`Promise`\<`TransactionInstruction`[]\>

The instruction that updates the registry data.

## Example

```ts
const instructions = await changeTwitterRegistryData("bonfida", owner, 0, Buffer.from("data"));
```
