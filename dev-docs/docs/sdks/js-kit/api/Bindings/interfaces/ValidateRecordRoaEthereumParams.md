---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / ValidateRecordRoaEthereumParams

# Interface: ValidateRecordRoaEthereumParams

Defined in: [bindings/validateRecordRoaEthereum.ts:25](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/validateRecordRoaEthereum.ts#L25)

Parameters for validating a record with an Ethereum signature.

## Example

```ts
const params: ValidateRecordRoaEthereumParams = {
  domain: "example.sns", record: Record.ETH, owner, payer, signature, expectedPubkey,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [bindings/validateRecordRoaEthereum.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/validateRecordRoaEthereum.ts#L27)

Full `.sns` domain name.

***

### expectedPubkey

> **expectedPubkey**: `Uint8Array`

Defined in: [bindings/validateRecordRoaEthereum.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/validateRecordRoaEthereum.ts#L37)

Expected Ethereum public key.

***

### owner

> **owner**: `Address`

Defined in: [bindings/validateRecordRoaEthereum.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/validateRecordRoaEthereum.ts#L31)

Current domain owner.

***

### payer

> **payer**: `Address`

Defined in: [bindings/validateRecordRoaEthereum.ts:33](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/validateRecordRoaEthereum.ts#L33)

Instruction fee payer.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [bindings/validateRecordRoaEthereum.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/validateRecordRoaEthereum.ts#L29)

Record type.

***

### signature

> **signature**: `Uint8Array`

Defined in: [bindings/validateRecordRoaEthereum.ts:35](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/validateRecordRoaEthereum.ts#L35)

Ethereum signature.
