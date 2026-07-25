---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / ReverseTwitterRegistryStateParams

# Interface: ReverseTwitterRegistryStateParams

Defined in: [twitter/ReverseTwitterRegistryState.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/twitter/ReverseTwitterRegistryState.ts#L14)

Input for decoding a reverse Twitter registry.

## Example

```ts
const params: ReverseTwitterRegistryStateParams = { twitterRegistryKey, twitterHandle: "bonfida" };
```

## Properties

### twitterHandle

> **twitterHandle**: `string`

Defined in: [twitter/ReverseTwitterRegistryState.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/twitter/ReverseTwitterRegistryState.ts#L18)

Verified Twitter handle.

***

### twitterRegistryKey

> **twitterRegistryKey**: `Uint8Array`

Defined in: [twitter/ReverseTwitterRegistryState.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/twitter/ReverseTwitterRegistryState.ts#L16)

Encoded verified Twitter registry address.
