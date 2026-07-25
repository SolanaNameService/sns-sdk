---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / UpdateNameRegistryInstructionParams

# Interface: UpdateNameRegistryInstructionParams

Defined in: [instructions/updateNameRegistryInstruction.ts:12](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/updateNameRegistryInstruction.ts#L12)

Input for updating an SNS name-registry account.

## Example

```ts
const params: UpdateNameRegistryInstructionParams = { offset: 0, inputData };
```

## Properties

### inputData

> **inputData**: `Uint8Array`

Defined in: [instructions/updateNameRegistryInstruction.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/updateNameRegistryInstruction.ts#L16)

Bytes to write.

***

### offset

> **offset**: `number`

Defined in: [instructions/updateNameRegistryInstruction.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/instructions/updateNameRegistryInstruction.ts#L14)

Byte offset where the update begins.
