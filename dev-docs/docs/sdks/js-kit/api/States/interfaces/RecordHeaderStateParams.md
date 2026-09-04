---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / RecordHeaderStateParams

# Interface: RecordHeaderStateParams

Defined in: [states/record.ts:52](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/states/record.ts#L52)

Input for decoding an SNS V2 record header.

## Example

```ts
const params: RecordHeaderStateParams = { stalenessValidation: 0, rightOfAssociationValidation: 0, contentLength: 0 };
```

## Properties

### contentLength

> **contentLength**: `number`

Defined in: [states/record.ts:58](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/states/record.ts#L58)

Record content length in bytes.

***

### rightOfAssociationValidation

> **rightOfAssociationValidation**: `number`

Defined in: [states/record.ts:56](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/states/record.ts#L56)

Right of Association validation mode.

***

### stalenessValidation

> **stalenessValidation**: `number`

Defined in: [states/record.ts:54](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/states/record.ts#L54)

Staleness validation mode.
