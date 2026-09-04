---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getSubdomains

# Function: getSubdomains()

> **getSubdomains**(`params`): `Promise`\<[`GetSubdomainsResult`](../interfaces/GetSubdomainsResult.md)[]\>

Defined in: [domain/getSubdomains.ts:70](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSubdomains.ts#L70)

Retrieves subdomains under a parent domain, including their owners.

Entries without reverse lookup data are omitted. Passing a subdomain returns
an empty array.

## Parameters

### params

[`GetSubdomainsParams`](../interfaces/GetSubdomainsParams.md)

Subdomain retrieval parameters

## Returns

`Promise`\<[`GetSubdomainsResult`](../interfaces/GetSubdomainsResult.md)[]\>

Subdomain names and owner addresses.

## Example

```ts
const subdomains = await getSubdomains({ rpc, domain: "example.sns" });
```
