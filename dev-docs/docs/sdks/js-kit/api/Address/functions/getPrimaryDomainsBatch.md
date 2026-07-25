---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / getPrimaryDomainsBatch

# Function: getPrimaryDomainsBatch()

> **getPrimaryDomainsBatch**(`params`): `Promise`\<(`string` \| `undefined`)[]\>

Defined in: [address/getPrimaryDomainsBatch.ts:62](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/address/getPrimaryDomainsBatch.ts#L62)

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
