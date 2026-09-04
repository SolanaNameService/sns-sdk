---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordOptions

# Interface: GetDomainRecordOptions

Defined in: [domain/getDomainRecord.ts:29](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L29)

Options for retrieving a domain record.

## Example

```ts
const options: GetDomainRecordOptions = { deserialize: true };
```

## Properties

### deserialize?

> `optional` **deserialize?**: `boolean`

Defined in: [domain/getDomainRecord.ts:31](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L31)

Whether to decode record content.

***

### verifier?

> `optional` **verifier?**: `ReadonlyUint8Array`\<`ArrayBufferLike`\>

Defined in: [domain/getDomainRecord.ts:33](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainRecord.ts#L33)

Custom Right of Association verifier.
