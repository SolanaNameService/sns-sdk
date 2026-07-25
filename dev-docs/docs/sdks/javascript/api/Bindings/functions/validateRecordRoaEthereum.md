---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / validateRecordRoaEthereum

# Function: validateRecordRoaEthereum()

> **validateRecordRoaEthereum**(`domain`, `record`, `owner`, `payer`, `signature`, `expectedPubkey`): `TransactionInstruction`

Defined in: [bindings/validateRecordRoaEthereum.ts:35](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/bindings/validateRecordRoaEthereum.ts#L35)

Builds an instruction to validate a record's Right of Association with an Ethereum signature.

## Parameters

### domain

`string`

Full `.sns` domain or subdomain name

### record

[`Record`](../../Records/enumerations/Record.md)

Record type

### owner

`PublicKey`

Current owner of the domain

### payer

`PublicKey`

Fee payer for the instruction

### signature

`Buffer`

The 64-byte Ethereum signature used for validation

### expectedPubkey

`Buffer`

The 20-byte Ethereum public key expected to match the signature

## Returns

`TransactionInstruction`

Transaction instruction.

## Example

```ts
const instruction = validateRecordRoaEthereum(
  "example.sns",
  Record.ETH,
  owner,
  payer,
  signature,
  addressBytes,
);
```
