---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / ResolveParams

# Interface: ResolveParams

Defined in: [domain/resolveTypes.ts:28](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/resolveTypes.ts#L28)

Parameters for resolving a domain.

## Example

```ts
const params: ResolveParams = { rpc, domain: "example.sns" };
```

## Properties

### domain

> **domain**: `string`

Defined in: [domain/resolveTypes.ts:32](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/resolveTypes.ts#L32)

Full domain name.

***

### options?

> `optional` **options?**: [`ResolveOptions`](../type-aliases/ResolveOptions.md)

Defined in: [domain/resolveTypes.ts:34](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/resolveTypes.ts#L34)

Resolution options.

***

### rpc

> **rpc**: `ResolveRpc`

Defined in: [domain/resolveTypes.ts:30](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/resolveTypes.ts#L30)

RPC client.
