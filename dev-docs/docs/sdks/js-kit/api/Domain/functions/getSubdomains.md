---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getSubdomains

# Function: getSubdomains()

> **getSubdomains**(`params`): `Promise`\<[`GetSubdomainsResult`](../interfaces/GetSubdomainsResult.md)[]\>

Defined in: [domain/getSubdomains.ts:71](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/domain/getSubdomains.ts#L71)

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
