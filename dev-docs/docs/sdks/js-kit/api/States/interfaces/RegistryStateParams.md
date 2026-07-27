---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [States](../index.md) / RegistryStateParams

# Interface: RegistryStateParams

Defined in: [states/registry.ts:25](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/registry.ts#L25)

Input for decoding an SNS name-registry account.

## Example

```ts
const params: RegistryStateParams = { parentName, owner, class: classAddress };
```

## Properties

### class

> **class**: `Uint8Array`

Defined in: [states/registry.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/registry.ts#L31)

Encoded registry class address.

***

### owner

> **owner**: `Uint8Array`

Defined in: [states/registry.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/registry.ts#L29)

Encoded registry owner address.

***

### parentName

> **parentName**: `Uint8Array`

Defined in: [states/registry.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/states/registry.ts#L27)

Encoded parent registry address.
