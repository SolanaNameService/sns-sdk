---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / burnDomain

# Function: burnDomain()

> **burnDomain**(`domain`, `owner`, `target`): `TransactionInstruction`

Defined in: [bindings/burnDomain.ts:26](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/bindings/burnDomain.ts#L26)

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
