---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / getTwitterRegistryKey

# Function: getTwitterRegistryKey()

> **getTwitterRegistryKey**(`twitter_handle`): `Promise`\<`PublicKey`\>

Defined in: [twitter/getTwitterRegistryKey.ts:17](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/twitter/getTwitterRegistryKey.ts#L17)

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
