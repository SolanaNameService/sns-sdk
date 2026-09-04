---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getDomainOwner

# Function: getDomainOwner()

> **getDomainOwner**(`params`): `Promise`\<`Address`\>

Defined in: [domain/getDomainOwner.ts:39](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getDomainOwner.ts#L39)

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
