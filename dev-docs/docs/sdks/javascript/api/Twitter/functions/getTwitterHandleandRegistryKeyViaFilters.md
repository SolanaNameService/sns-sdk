---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / getTwitterHandleandRegistryKeyViaFilters

# Function: getTwitterHandleandRegistryKeyViaFilters()

> **getTwitterHandleandRegistryKeyViaFilters**(`connection`, `verifiedPubkey`): `Promise`\<\[`string`, `PublicKey`\]\>

Defined in: [twitter/getTwitterHandleandRegistryKeyViaFilters.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/twitter/getTwitterHandleandRegistryKeyViaFilters.ts#L28)

Retrieves a Twitter handle and registry key through an RPC program-account query.

RPC filtering performance varies by provider.

## Parameters

### connection

`Connection`

Solana RPC connection used for the program-account query.

### verifiedPubkey

`PublicKey`

Verified public key to find.

## Returns

`Promise`\<\[`string`, `PublicKey`\]\>

The Twitter handle and its user-facing registry address.

## Throws

When no matching reverse registry is found.

## Example

```ts
const [handle, registry] = await getTwitterHandleandRegistryKeyViaFilters(connection, owner);
```
