---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / RecordHeaderStateParams

# Interface: RecordHeaderStateParams

Defined in: [states/record.ts:52](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/record.ts#L52)

Input for decoding an SNS V2 record header.

## Example

```ts
const params: RecordHeaderStateParams = { stalenessValidation: 0, rightOfAssociationValidation: 0, contentLength: 0 };
```

## Properties

### contentLength

> **contentLength**: `number`

Defined in: [states/record.ts:58](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/record.ts#L58)

Record content length in bytes.

***

### rightOfAssociationValidation

> **rightOfAssociationValidation**: `number`

Defined in: [states/record.ts:56](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/record.ts#L56)

Right of Association validation mode.

***

### stalenessValidation

> **stalenessValidation**: `number`

Defined in: [states/record.ts:54](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/states/record.ts#L54)

Staleness validation mode.
