---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / burnDomain

# Function: burnDomain()

> **burnDomain**(`domain`, `owner`, `target`): `TransactionInstruction`

Defined in: [bindings/burnDomain.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/bindings/burnDomain.ts#L26)

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
