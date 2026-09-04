---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / \_createAtaIdempotentInstruction

# Function: \_createAtaIdempotentInstruction()

> **\_createAtaIdempotentInstruction**(`programAddress`, `payer`, `ata`, `owner`, `mint`, `systemProgram`, `splTokenProgram`): `Instruction`

Defined in: [instructions/createAtaIdempotentInstruction.ts:32](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/createAtaIdempotentInstruction.ts#L32)

Creates an idempotent associated-token-account instruction.

The instruction succeeds when the associated token account already exists,
allowing callers to include it safely before token transfers.

## Parameters

### programAddress

`Address`

Associated Token Program address

### payer

`Address`

Account funding associated token account creation

### ata

`Address`

Derived associated token account address

### owner

`Address`

Owner of the associated token account

### mint

`Address`

Token mint for the associated token account

### systemProgram

`Address`

Solana System Program address

### splTokenProgram

`Address`

SPL Token Program address

## Returns

`Instruction`

Idempotent associated-token-account creation instruction

## Example

```ts
const instruction = _createAtaIdempotentInstruction(
  ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
  payer,
  ata,
  owner,
  mint,
  SYSTEM_PROGRAM_ADDRESS,
  TOKEN_PROGRAM_ADDRESS,
);
```
