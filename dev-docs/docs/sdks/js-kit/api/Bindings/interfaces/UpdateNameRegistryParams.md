---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / UpdateNameRegistryParams

# Interface: UpdateNameRegistryParams

Defined in: [bindings/updateNameRegistry.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/updateNameRegistry.ts#L21)

Input for updating bytes in a raw SNS name-registry account.

## Example

```ts
const params: UpdateNameRegistryParams = {
  rpc,
  domain: "example",
  offset: 0,
  data: new TextEncoder().encode("data"),
};
```

## Properties

### classAddress?

> `optional` **classAddress?**: `Address`

Defined in: [bindings/updateNameRegistry.ts:35](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/updateNameRegistry.ts#L35)

Optional class address for the registry.

***

### data

> **data**: `Uint8Array`

Defined in: [bindings/updateNameRegistry.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/updateNameRegistry.ts#L32)

Bytes to write to the registry.

***

### domain

> **domain**: `string`

Defined in: [bindings/updateNameRegistry.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/updateNameRegistry.ts#L26)

Raw registry seed/name to update.

***

### offset

> **offset**: `number`

Defined in: [bindings/updateNameRegistry.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/updateNameRegistry.ts#L29)

Byte offset where the update begins.

***

### parentAddress?

> `optional` **parentAddress?**: `Address`

Defined in: [bindings/updateNameRegistry.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/updateNameRegistry.ts#L39)

Optional parent name-account address.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi`\>

Defined in: [bindings/updateNameRegistry.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/updateNameRegistry.ts#L23)

RPC client used to retrieve the registry owner.
