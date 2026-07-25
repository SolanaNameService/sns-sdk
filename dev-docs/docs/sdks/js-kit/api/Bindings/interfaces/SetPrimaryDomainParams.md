---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / SetPrimaryDomainParams

# Interface: SetPrimaryDomainParams

Defined in: [bindings/setPrimaryDomain.ts:20](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/setPrimaryDomain.ts#L20)

Input for setting an owner's already-derived SNS primary domain.

## Example

```ts
const params: SetPrimaryDomainParams = { rpc, domainAddress, owner };
```

## Properties

### domainAddress

> **domainAddress**: `Address`

Defined in: [bindings/setPrimaryDomain.ts:25](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/setPrimaryDomain.ts#L25)

Already-derived SNS domain account address.

***

### owner

> **owner**: `Address`

Defined in: [bindings/setPrimaryDomain.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/setPrimaryDomain.ts#L28)

Owner of the domain account.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi`\>

Defined in: [bindings/setPrimaryDomain.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/bindings/setPrimaryDomain.ts#L22)

RPC client used to retrieve the domain registry.
