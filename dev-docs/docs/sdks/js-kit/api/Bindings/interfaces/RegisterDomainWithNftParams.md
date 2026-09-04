---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / RegisterDomainWithNftParams

# Interface: RegisterDomainWithNftParams

Defined in: [bindings/registerDomainWithNft.ts:34](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomainWithNft.ts#L34)

Parameters for registering an SNS domain with an NFT.

## Example

```ts
const params: RegisterDomainWithNftParams = {
  domain: "example.sns",
  space: 1_000,
  buyer,
  nftSource,
  nftMint,
};
```

## Properties

### buyer

> **buyer**: `Address`

Defined in: [bindings/registerDomainWithNft.ts:40](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomainWithNft.ts#L40)

Account registering the domain.

***

### domain

> **domain**: `string`

Defined in: [bindings/registerDomainWithNft.ts:36](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomainWithNft.ts#L36)

Full `.sns` domain name.

***

### nftMint

> **nftMint**: `Address`

Defined in: [bindings/registerDomainWithNft.ts:44](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomainWithNft.ts#L44)

Bonfida Wolves NFT mint.

***

### nftSource

> **nftSource**: `Address`

Defined in: [bindings/registerDomainWithNft.ts:42](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomainWithNft.ts#L42)

Source token account for the NFT.

***

### space

> **space**: `number`

Defined in: [bindings/registerDomainWithNft.ts:38](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomainWithNft.ts#L38)

Domain registry size in bytes.
