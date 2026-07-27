---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / DeleteNameRegistryParams

# Interface: DeleteNameRegistryParams

Defined in: [bindings/deleteNameRegistry.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/bindings/deleteNameRegistry.ts#L16)

Parameters for deleting a name registry.

## Example

```ts
const params: DeleteNameRegistryParams = { rpc, name: "example", refundAddress };
```

## Properties

### classAddress?

> `optional` **classAddress?**: `Address`

Defined in: [bindings/deleteNameRegistry.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/bindings/deleteNameRegistry.ts#L24)

Registry class address.

***

### name

> **name**: `string`

Defined in: [bindings/deleteNameRegistry.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/bindings/deleteNameRegistry.ts#L20)

Raw registry name.

***

### parentAddress?

> `optional` **parentAddress?**: `Address`

Defined in: [bindings/deleteNameRegistry.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/bindings/deleteNameRegistry.ts#L26)

Parent registry address.

***

### refundAddress

> **refundAddress**: `Address`

Defined in: [bindings/deleteNameRegistry.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/bindings/deleteNameRegistry.ts#L22)

Account receiving refunded rent.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi`\>

Defined in: [bindings/deleteNameRegistry.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/bindings/deleteNameRegistry.ts#L18)

RPC client.
