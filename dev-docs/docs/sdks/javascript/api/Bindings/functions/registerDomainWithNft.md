---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / registerDomainWithNft

# Function: registerDomainWithNft()

> **registerDomainWithNft**(`domain`, `space`, `nameAccount`, `reverseLookupAccount`, `buyer`, `nftSource`, `nftMint`): `TransactionInstruction`

Defined in: [bindings/registerDomainWithNft.ts:68](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/bindings/registerDomainWithNft.ts#L68)

Builds an instruction to register a top-level `.sns` domain using a Wolves NFT.

The `nameAccount` and `reverseLookupAccount` keys must be pre-derived with
`getSnsDomainKeySync` and `getReverseKeySync` respectively before
calling this function.

## Parameters

### domain

`string`

Full `.sns` domain name

### space

`number`

The number of bytes to allocate for the name account data

### nameAccount

`PublicKey`

The derived public key of the domain name account

### reverseLookupAccount

`PublicKey`

The derived public key of the reverse lookup account

### buyer

`PublicKey`

Buyer paying for the registration and holding the NFT

### nftSource

`PublicKey`

The buyer's token account holding the Wolves NFT

### nftMint

`PublicKey`

The mint address of the Wolves NFT

## Returns

`TransactionInstruction`

Transaction instruction.

## Example

```ts
const instruction = registerDomainWithNft(
  "example.sns",
  1_000,
  nameAccount,
  reverseAccount,
  buyer,
  nftSource,
  nftMint,
);
```
