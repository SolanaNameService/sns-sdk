---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / getTwitterRegistryKey

# Function: getTwitterRegistryKey()

> **getTwitterRegistryKey**(`twitter_handle`): `Promise`\<`PublicKey`\>

Defined in: [twitter/getTwitterRegistryKey.ts:17](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/twitter/getTwitterRegistryKey.ts#L17)

Derives the user-facing name registry key for a Twitter handle.

## Parameters

### twitter\_handle

`string`

Twitter handle without the `@` prefix

## Returns

`Promise`\<`PublicKey`\>

Derived Twitter name-registry account public key

## Example

```ts
const key = await getTwitterRegistryKey("bonfida");
```
