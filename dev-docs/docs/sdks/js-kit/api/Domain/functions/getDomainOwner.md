---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getDomainOwner

# Function: getDomainOwner()

> **getDomainOwner**(`params`): `Promise`\<`Address`\>

Defined in: [domain/getDomainOwner.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/domain/getDomainOwner.ts#L40)

Retrieves the owner of the specified domain. If the domain is tokenized,
the NFT's owner is returned; otherwise, the registry owner is returned.

## Parameters

### params

[`GetDomainOwnerParams`](../interfaces/GetDomainOwnerParams.md)

Domain owner retrieval parameters

## Returns

`Promise`\<`Address`\>

The domain owner address.

## Example

```ts
const owner = await getDomainOwner({ rpc, domain: "example.sns" });
```
