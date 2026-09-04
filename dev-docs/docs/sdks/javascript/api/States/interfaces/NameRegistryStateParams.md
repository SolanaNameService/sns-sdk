---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [States](../index.md) / NameRegistryStateParams

# Interface: NameRegistryStateParams

Defined in: [state.ts:15](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/state.ts#L15)

Input for decoding an SNS name registry account.

## Example

```ts
const params: NameRegistryStateParams = { parentName, owner, class: classAddress };
```

## Properties

### class

> **class**: `Uint8Array`

Defined in: [state.ts:21](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/state.ts#L21)

Encoded registry class address.

***

### owner

> **owner**: `Uint8Array`

Defined in: [state.ts:19](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/state.ts#L19)

Encoded registry owner address.

***

### parentName

> **parentName**: `Uint8Array`

Defined in: [state.ts:17](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/state.ts#L17)

Encoded parent registry address.
