---
title: "Domain API"
sidebar_label: "Domain"
hide_title: true
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../index.md) / Domain

# Domain

Domain resolution, derivation, records, and subdomain APIs.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [GetAllSnsDomainsParams](interfaces/GetAllSnsDomainsParams.md) | Parameters for retrieving all SNS domains. |
| [GetAllSnsDomainsResult](interfaces/GetAllSnsDomainsResult.md) | A top-level SNS domain account. |
| [GetDomainOwnerParams](interfaces/GetDomainOwnerParams.md) | Parameters for retrieving a domain owner. |
| [GetDomainRecordOptions](interfaces/GetDomainRecordOptions.md) | Options for retrieving a domain record. |
| [GetDomainRecordParams](interfaces/GetDomainRecordParams.md) | Parameters for retrieving a domain record. |
| [GetDomainRecordResult](interfaces/GetDomainRecordResult.md) | A retrieved domain record. |
| [GetDomainRecordsOptions](interfaces/GetDomainRecordsOptions.md) | Options for retrieving domain records. |
| [GetDomainRecordsParams](interfaces/GetDomainRecordsParams.md) | Parameters for retrieving domain records. |
| [GetDomainRecordsResult](interfaces/GetDomainRecordsResult.md) | A retrieved domain record. |
| [GetDomainRecordsVerification](interfaces/GetDomainRecordsVerification.md) | Verification status for a domain record. |
| [GetDomainRecordVerification](interfaces/GetDomainRecordVerification.md) | Verification status for a domain record. |
| [GetSnsDomainAddressParams](interfaces/GetSnsDomainAddressParams.md) | Parameters for deriving an SNS domain address. |
| [GetSnsDomainAddressResult](interfaces/GetSnsDomainAddressResult.md) | A derived SNS domain address. |
| [GetSrsDomainAddressParams](interfaces/GetSrsDomainAddressParams.md) | Parameters for deriving an SRS domain address. |
| [GetSrsDomainAddressResult](interfaces/GetSrsDomainAddressResult.md) | A derived SRS domain address. |
| [GetSubdomainsParams](interfaces/GetSubdomainsParams.md) | Parameters for retrieving subdomains under a parent domain. |
| [GetSubdomainsResult](interfaces/GetSubdomainsResult.md) | A subdomain and the owner recorded in its name registry. |
| [ResolveParams](interfaces/ResolveParams.md) | Parameters for resolving a domain. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ResolveOptions](type-aliases/ResolveOptions.md) | Controls whether resolution may return program-derived addresses. |

## Functions

| Function | Description |
| ------ | ------ |
| [getAllSnsDomains](functions/getAllSnsDomains.md) | Retrieves all top-level SNS domain accounts. |
| [getDomainOwner](functions/getDomainOwner.md) | Retrieves the owner of the specified domain. If the domain is tokenized, the NFT's owner is returned; otherwise, the registry owner is returned. |
| [getDomainRecord](functions/getDomainRecord.md) | Retrieves a V2 record under a domain, verifies it, and optionally decodes its content. |
| [getDomainRecords](functions/getDomainRecords.md) | Retrieves V2 records under a domain, verifies them, and optionally decodes their content. |
| [getSnsDomainAddress](functions/getSnsDomainAddress.md) | Derives the address of a domain, subdomain, or record account. |
| [getSrsDomainAddress](functions/getSrsDomainAddress.md) | Derives the canonical SRS record address for a TLD-trimmed `.sol` name. |
| [getSubdomains](functions/getSubdomains.md) | Retrieves subdomains under a parent domain, including their owners. |
| [resolve](functions/resolve.md) | Resolves a `.sns` or `.sol` domain to its target address. |
