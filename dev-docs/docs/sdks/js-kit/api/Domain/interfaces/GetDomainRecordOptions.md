---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / GetDomainRecordOptions

# Interface: GetDomainRecordOptions

Defined in: [domain/getDomainRecord.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getDomainRecord.ts#L30)

Options for retrieving a domain record.

## Example

```ts
const options: GetDomainRecordOptions = { deserialize: true };
```

## Properties

### deserialize?

> `optional` **deserialize?**: `boolean`

Defined in: [domain/getDomainRecord.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getDomainRecord.ts#L32)

Whether to decode record content.

***

### verifier?

> `optional` **verifier?**: `ReadonlyUint8Array`\<`ArrayBufferLike`\>

Defined in: [domain/getDomainRecord.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getDomainRecord.ts#L34)

Custom Right of Association verifier.
