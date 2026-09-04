---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / registerDomainWithNft

# Function: registerDomainWithNft()

> **registerDomainWithNft**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/registerDomainWithNft.ts:69](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomainWithNft.ts#L69)

Builds an instruction to register a top-level `.sns` domain using a Bonfida Wolves NFT.

## Parameters

### params

[`RegisterDomainWithNftParams`](../interfaces/RegisterDomainWithNftParams.md)

Registration parameters

## Returns

`Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Transaction instruction.

## Example

```ts
const instruction = await registerDomainWithNft({
  domain: "example.sns",
  space: 1_000,
  buyer,
  nftSource,
  nftMint,
});
```
