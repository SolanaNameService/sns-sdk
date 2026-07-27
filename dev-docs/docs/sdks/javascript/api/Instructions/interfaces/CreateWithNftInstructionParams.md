---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Instructions](../index.md) / CreateWithNftInstructionParams

# Interface: CreateWithNftInstructionParams

Defined in: [instructions/createWithNftInstruction.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/instructions/createWithNftInstruction.ts#L14)

Input for registration with an eligible NFT.

## Example

```ts
const params: CreateWithNftInstructionParams = { name: "example", space: 1_000 };
```

## Properties

### name

> **name**: `string`

Defined in: [instructions/createWithNftInstruction.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/instructions/createWithNftInstruction.ts#L16)

TLD-less domain name.

***

### space

> **space**: `number`

Defined in: [instructions/createWithNftInstruction.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/instructions/createWithNftInstruction.ts#L18)

Account data size in bytes.
