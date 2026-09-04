---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Domain](../index.md) / getSrsDomainAddress

# ~~Variable: getSrsDomainAddress~~

> `const` **getSrsDomainAddress**: (`params`) => `Promise`\<[`GetSolDomainAddressResult`](../interfaces/GetSolDomainAddressResult.md)\> = `getSolDomainAddress`

Defined in: [domain/getSrsDomainAddress.ts:26](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/domain/getSrsDomainAddress.ts#L26)

Derives the canonical SRS record address for a TLD-trimmed `.sol` name.

Derives the canonical SRS record address for a TLD-trimmed `.sol` name.

## Parameters

### params

[`GetSolDomainAddressParams`](../interfaces/GetSolDomainAddressParams.md)

Derivation parameters

## Returns

`Promise`\<[`GetSolDomainAddressResult`](../interfaces/GetSolDomainAddressResult.md)\>

The SRS record address and canonical name hash.

## Example

```ts
const derived = await getSolDomainAddress({ domain: "example" });
```

## Deprecated

Use [getSolDomainAddress](../functions/getSolDomainAddress.md) instead.

## Param

**params**

Derivation parameters

## Param

**params.domain**

TLD-trimmed `.sol` domain name

## Returns

The SRS record address and canonical name hash.

## Example

```ts
const derived = await getSrsDomainAddress({ domain: "example" });
```
