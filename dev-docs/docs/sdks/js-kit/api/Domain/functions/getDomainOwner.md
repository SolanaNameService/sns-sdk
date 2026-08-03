---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getDomainOwner

# Function: getDomainOwner()

> **getDomainOwner**(`params`): `Promise`\<`Address`\>

Defined in: [domain/getDomainOwner.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/domain/getDomainOwner.ts#L40)

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
