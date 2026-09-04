---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Records](../index.md) / Validation

# Enumeration: Validation

Defined in: [record/const.ts:5](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/const.ts#L5)

On-chain record validation scheme identifiers.

## Enumeration Members

### Ethereum

> **Ethereum**: `2`

Defined in: [record/const.ts:11](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/const.ts#L11)

Validation uses an Ethereum signature.

***

### None

> **None**: `0`

Defined in: [record/const.ts:7](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/const.ts#L7)

No validation is required.

***

### Solana

> **Solana**: `1`

Defined in: [record/const.ts:9](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/const.ts#L9)

Validation uses a Solana signature.

***

### UnverifiedSolana

> **UnverifiedSolana**: `3`

Defined in: [record/const.ts:13](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/record/const.ts#L13)

Solana validation is present but unverified.
