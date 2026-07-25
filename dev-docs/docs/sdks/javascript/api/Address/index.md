---
title: "Address API"
sidebar_label: "Address"
hide_title: true
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../index.md) / Address

# Address

Wallet ownership, primary-domain, and wallet-domain lookup APIs.

## Classes

| Class | Description |
| ------ | ------ |
| [PrimaryDomain](classes/PrimaryDomain.md) | Deserialized primary-domain account and its address derivation helpers. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [PrimaryDomainParams](interfaces/PrimaryDomainParams.md) | Input for decoding a primary-domain account. |
| [SnsDomain](interfaces/SnsDomain.md) | A directly registry-owned top-level SNS domain. |
| [SnsNft](interfaces/SnsNft.md) | A tokenized SNS domain and its associated NFT mint. |

## Variables

| Variable | Description |
| ------ | ------ |
| [NAME\_OFFERS\_ID](variables/NAME_OFFERS_ID.md) | Program ID that stores wallet primary-domain selections. |

## Functions

| Function | Description |
| ------ | ------ |
| [getMultiplePrimaryDomains](functions/getMultiplePrimaryDomains.md) | Retrieves primary domain names for multiple wallets, up to a maximum of 100. |
| [getPrimaryDomain](functions/getPrimaryDomain.md) | Retrieves the primary domain set for a wallet. |
| [getSnsDomainKeysForOwner](functions/getSnsDomainKeysForOwner.md) | Retrieves top-level `.sns` domain accounts owned by a wallet. |
| [getSnsDomainsForOwner](functions/getSnsDomainsForOwner.md) | Retrieves directly registry-owned top-level `.sns` domains for a wallet. |
| [getSnsNftsForOwner](functions/getSnsNftsForOwner.md) | Retrieves tokenized `.sns` domains owned by a wallet. |
