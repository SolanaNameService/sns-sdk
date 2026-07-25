---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / ResolveParams

# Interface: ResolveParams

Defined in: [domain/resolveTypes.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/resolveTypes.ts#L32)

Parameters for resolving a domain.

## Example

```ts
const params: ResolveParams = { rpc, domain: "example.sns" };
```

## Properties

### domain

> **domain**: `string`

Defined in: [domain/resolveTypes.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/resolveTypes.ts#L36)

Full domain name.

***

### options?

> `optional` **options?**: [`ResolveOptions`](../type-aliases/ResolveOptions.md)

Defined in: [domain/resolveTypes.ts:38](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/resolveTypes.ts#L38)

Resolution options.

***

### rpc

> **rpc**: `ResolveRpc`

Defined in: [domain/resolveTypes.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/resolveTypes.ts#L34)

RPC client.
