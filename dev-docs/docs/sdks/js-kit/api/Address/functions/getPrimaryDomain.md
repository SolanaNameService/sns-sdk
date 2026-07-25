---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Address](../index.md) / getPrimaryDomain

# Function: getPrimaryDomain()

> **getPrimaryDomain**(`params`): `Promise`\<[`GetPrimaryDomainResult`](../interfaces/GetPrimaryDomainResult.md)\>

Defined in: [address/getPrimaryDomain.ts:69](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/address/getPrimaryDomain.ts#L69)

Retrieves the primary SNS domain associated with a wallet address.

Returned domain names omit the TLD suffix; subdomain primary names can
include parent labels such as `sub.parent`.

## Parameters

### params

[`GetPrimaryDomainParams`](../interfaces/GetPrimaryDomainParams.md)

Primary domain retrieval parameters

## Returns

`Promise`\<[`GetPrimaryDomainResult`](../interfaces/GetPrimaryDomainResult.md)\>

Primary domain address, domain name, and stale status.

## Example

```ts
const primary = await getPrimaryDomain({ rpc, walletAddress });
```
