---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / CreateWithNftInstructionParams

# Interface: CreateWithNftInstructionParams

Defined in: [instructions/createWithNftInstruction.ts:12](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/createWithNftInstruction.ts#L12)

Input for registering an SNS domain backed by an NFT.

## Example

```ts
const params: CreateWithNftInstructionParams = { name: "example", space: 1_000 };
```

## Properties

### name

> **name**: `string`

Defined in: [instructions/createWithNftInstruction.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/createWithNftInstruction.ts#L14)

TLD-less domain name.

***

### space

> **space**: `number`

Defined in: [instructions/createWithNftInstruction.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/createWithNftInstruction.ts#L16)

Account data size in bytes.
