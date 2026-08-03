---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getSubdomains

# Function: getSubdomains()

> **getSubdomains**(`params`): `Promise`\<[`GetSubdomainsResult`](../interfaces/GetSubdomainsResult.md)[]\>

Defined in: [domain/getSubdomains.ts:71](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getSubdomains.ts#L71)

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
