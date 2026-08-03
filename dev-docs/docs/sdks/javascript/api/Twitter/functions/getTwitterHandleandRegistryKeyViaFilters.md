---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Twitter](../index.md) / getTwitterHandleandRegistryKeyViaFilters

# Function: getTwitterHandleandRegistryKeyViaFilters()

> **getTwitterHandleandRegistryKeyViaFilters**(`connection`, `verifiedPubkey`): `Promise`\<\[`string`, `PublicKey`\]\>

Defined in: [twitter/getTwitterHandleandRegistryKeyViaFilters.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/twitter/getTwitterHandleandRegistryKeyViaFilters.ts#L28)

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
