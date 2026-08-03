---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / burnDomain

# Function: burnDomain()

> **burnDomain**(`domain`, `owner`, `target`): `TransactionInstruction`

Defined in: [bindings/burnDomain.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/bindings/burnDomain.ts#L26)

Builds an instruction to burn a top-level `.sns` domain and its reverse lookup account.

## Parameters

### domain

`string`

Full `.sns` domain name

### owner

`PublicKey`

Current owner of the domain

### target

`PublicKey`

Account that receives reclaimed lamports

## Returns

`TransactionInstruction`

Transaction instruction.

## Example

```ts
const instruction = burnDomain("example.sns", owner, refundTarget);
```
