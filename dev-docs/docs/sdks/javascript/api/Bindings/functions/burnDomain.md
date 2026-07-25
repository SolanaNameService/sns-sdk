---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / burnDomain

# Function: burnDomain()

> **burnDomain**(`domain`, `owner`, `target`): `TransactionInstruction`

Defined in: [bindings/burnDomain.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/bindings/burnDomain.ts#L26)

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
