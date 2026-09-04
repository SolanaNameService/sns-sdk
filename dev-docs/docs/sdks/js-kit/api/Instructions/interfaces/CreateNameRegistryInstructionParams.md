---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / CreateNameRegistryInstructionParams

# Interface: CreateNameRegistryInstructionParams

Defined in: [instructions/createNameRegistryInstruction.ts:14](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/createNameRegistryInstruction.ts#L14)

Input for creating an SNS name-registry account.

## Example

```ts
const params: CreateNameRegistryInstructionParams = { nameHash, lamports, space: 32 };
```

## Properties

### lamports

> **lamports**: `bigint`

Defined in: [instructions/createNameRegistryInstruction.ts:18](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/createNameRegistryInstruction.ts#L18)

Account funding amount.

***

### nameHash

> **nameHash**: `Uint8Array`

Defined in: [instructions/createNameRegistryInstruction.ts:16](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/createNameRegistryInstruction.ts#L16)

Hash of the registry name.

***

### space

> **space**: `number`

Defined in: [instructions/createNameRegistryInstruction.ts:20](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/instructions/createNameRegistryInstruction.ts#L20)

Account data size in bytes.
