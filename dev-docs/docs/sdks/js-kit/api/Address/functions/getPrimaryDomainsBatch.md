---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / getPrimaryDomainsBatch

# Function: getPrimaryDomainsBatch()

> **getPrimaryDomainsBatch**(`params`): `Promise`\<(`string` \| `undefined`)[]\>

Defined in: [address/getPrimaryDomainsBatch.ts:62](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/address/getPrimaryDomainsBatch.ts#L62)

Retrieves primary SNS domain names for multiple wallet addresses.

Returned values are index-aligned with `walletAddresses`. Domain names omit
the TLD suffix; subdomain primary names can include parent labels such as
`sub.parent`.

## Parameters

### params

[`GetPrimaryDomainsBatchParams`](../interfaces/GetPrimaryDomainsBatchParams.md)

Primary domain retrieval parameters

## Returns

`Promise`\<(`string` \| `undefined`)[]\>

Primary domain names, or `undefined` when no valid non-stale primary domain is found.

## Example

```ts
const domains = await getPrimaryDomainsBatch({ rpc, walletAddresses });
```
