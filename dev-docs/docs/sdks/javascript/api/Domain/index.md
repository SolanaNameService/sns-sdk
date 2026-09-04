---
title: "Domain API"
sidebar_label: "Domain"
hide_title: true
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../index.md) / Domain

# Domain

Domain resolution, derivation, reverse lookup, and discovery APIs.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [SnsDomainKey](interfaces/SnsDomainKey.md) | A derived SNS domain account and its parent metadata. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ResolveConfig](type-aliases/ResolveConfig.md) | Controls whether resolution may return program-derived-address owners. |

## Functions

| Function | Description |
| ------ | ------ |
| [findSubdomains](functions/findSubdomains.md) | Finds subdomains for a parent domain account. |
| [getAllSnsDomains](functions/getAllSnsDomains.md) | Retrieves all registered top-level `.sns` domain accounts. |
| [getAllSolDomains](functions/getAllSolDomains.md) | Retrieves all registered top-level `.sol` domain accounts, including expired domains. |
| [getDomainPriceFromName](functions/getDomainPriceFromName.md) | Retrieves the domain registration price in USD from a domain name. |
| [getSnsDomainKeySync](functions/getSnsDomainKeySync.md) | Derives an SNS namespace account from a TLD-trimmed domain name. |
| [getSolDomainKeySync](functions/getSolDomainKeySync.md) | Derives the canonical SRS record account for a `.sol` domain. |
| [getSrsRecordSeed](functions/getSrsRecordSeed.md) | Encodes a TLD-trimmed `.sol` domain name as the current SRS record seed. |
| [resolve](functions/resolve.md) | Resolves a full `.sns` or `.sol` domain name to its effective target public key. |
| [reverseLookup](functions/reverseLookup.md) | Performs a reverse lookup for a domain account. |
| [reverseLookupBatch](functions/reverseLookupBatch.md) | Performs reverse lookups for domain accounts. |
| [safeResolve](functions/safeResolve.md) | Resolves a full `.sns` or `.sol` domain using the same routing as [resolve](functions/resolve.md). For domains with `.sol` suffix, the corresponding `.sns` domain must resolve to the same target; otherwise, [Errors.SnsSolResolutionMismatchError](../Errors/classes/SnsSolResolutionMismatchError.md) is thrown. |
