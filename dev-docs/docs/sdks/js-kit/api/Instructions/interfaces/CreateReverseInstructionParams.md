---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / CreateReverseInstructionParams

# Interface: CreateReverseInstructionParams

Defined in: [instructions/createReverseInstruction.ts:12](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/createReverseInstruction.ts#L12)

Input for creating an SNS reverse-lookup account.

## Example

```ts
const params: CreateReverseInstructionParams = { domain: "example" };
```

## Properties

### domain

> **domain**: `string`

Defined in: [instructions/createReverseInstruction.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/instructions/createReverseInstruction.ts#L14)

Raw reverse lookup payload.
