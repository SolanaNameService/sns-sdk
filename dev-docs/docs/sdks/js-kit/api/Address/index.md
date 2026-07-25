---
title: "Address API"
sidebar_label: "Address"
hide_title: true
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../index.md) / Address

# Address

Wallet primary-domain and owned-domain lookup APIs.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [GetPrimaryDomainParams](interfaces/GetPrimaryDomainParams.md) | Parameters for retrieving a wallet's primary domain. |
| [GetPrimaryDomainResult](interfaces/GetPrimaryDomainResult.md) | A wallet's primary domain. |
| [GetPrimaryDomainsBatchParams](interfaces/GetPrimaryDomainsBatchParams.md) | Parameters for retrieving primary domains for multiple wallets. |
| [GetSnsDomainsForAddressParams](interfaces/GetSnsDomainsForAddressParams.md) | Parameters for retrieving SNS domains owned by an address. |
| [GetSnsDomainsForAddressResult](interfaces/GetSnsDomainsForAddressResult.md) | An SNS domain owned directly by a registry address. |
| [GetSnsNftsForAddressParams](interfaces/GetSnsNftsForAddressParams.md) | Parameters for retrieving SNS domain NFTs owned by an address. |
| [GetSnsNftsForAddressResult](interfaces/GetSnsNftsForAddressResult.md) | An SNS domain NFT owned by an address. |

## Functions

| Function | Description |
| ------ | ------ |
| [getPrimaryDomain](functions/getPrimaryDomain.md) | Retrieves the primary SNS domain associated with a wallet address. |
| [getPrimaryDomainsBatch](functions/getPrimaryDomainsBatch.md) | Retrieves primary SNS domain names for multiple wallet addresses. |
| [getSnsDomainsForAddress](functions/getSnsDomainsForAddress.md) | Retrieves directly registry-owned top-level SNS domains for an address. |
| [getSnsNftsForAddress](functions/getSnsNftsForAddress.md) | Retrieves the SNS domain NFTs owned by a given address. |
