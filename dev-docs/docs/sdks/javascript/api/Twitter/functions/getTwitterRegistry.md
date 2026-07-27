---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / getTwitterRegistry

# Function: getTwitterRegistry()

> **getTwitterRegistry**(`connection`, `twitter_handle`): `Promise`\<[`NameRegistryState`](../../States/classes/NameRegistryState.md)\>

Defined in: [twitter/getTwitterRegistry.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/twitter/getTwitterRegistry.ts#L19)

Retrieves the user-facing name registry for a Twitter handle.

## Parameters

### connection

`Connection`

Solana RPC connection

### twitter\_handle

`string`

Twitter handle without the `@` prefix

## Returns

`Promise`\<[`NameRegistryState`](../../States/classes/NameRegistryState.md)\>

Name registry associated with the Twitter handle

## Example

```ts
const registry = await getTwitterRegistry(connection, "bonfida");
```
