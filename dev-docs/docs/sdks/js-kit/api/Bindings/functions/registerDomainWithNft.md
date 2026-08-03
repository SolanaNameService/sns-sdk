---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / registerDomainWithNft

# Function: registerDomainWithNft()

> **registerDomainWithNft**(`params`): `Promise`\<`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>\>

Defined in: [bindings/registerDomainWithNft.ts:69](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/registerDomainWithNft.ts#L69)

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
