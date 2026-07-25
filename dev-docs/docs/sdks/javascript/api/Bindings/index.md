---
title: "Bindings API"
sidebar_label: "Bindings"
hide_title: true
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../index.md) / Bindings

# Bindings

High-level builders for SNS transaction instructions.

## Functions

| Function | Description |
| ------ | ------ |
| [burnDomain](functions/burnDomain.md) | Builds an instruction to burn a top-level `.sns` domain and its reverse lookup account. |
| [createNameRegistry](functions/createNameRegistry.md) | Builds an instruction to create a name account with the given rent budget, space, owner, and class. |
| [createRecord](functions/createRecord.md) | Builds an instruction to create a record for a `.sns` domain or subdomain. |
| [createReverse](functions/createReverse.md) | Builds an instruction to create an SNS reverse lookup account. |
| [createSubdomain](functions/createSubdomain.md) | Builds the instructions to create a `.sns` subdomain. |
| [deleteNameRegistry](functions/deleteNameRegistry.md) | Builds an instruction to delete a name account and transfer reclaimed rent. |
| [deleteRecord](functions/deleteRecord.md) | Builds an instruction to delete a record for a `.sns` domain or subdomain. |
| [registerDomain](functions/registerDomain.md) | Builds the instructions to register a top-level `.sns` domain. |
| [registerDomainWithNft](functions/registerDomainWithNft.md) | Builds an instruction to register a top-level `.sns` domain using a Wolves NFT. |
| [setBackground](functions/setBackground.md) | Builds the instructions to set an issued custom background for a top-level `.sns` domain. |
| [setPrimaryDomain](functions/setPrimaryDomain.md) | Builds an instruction to set a domain as the owner's primary domain. |
| [setRecordRoaVerifier](functions/setRecordRoaVerifier.md) | Builds an instruction to store the expected Right of Association verifier. |
| [setRecordStalenessVerifier](functions/setRecordStalenessVerifier.md) | Builds an instruction to write or refresh staleness verifier metadata. |
| [transferDomain](functions/transferDomain.md) | Builds an instruction to transfer a top-level `.sns` domain. |
| [transferSubdomain](functions/transferSubdomain.md) | Builds an instruction to transfer a `.sns` subdomain. |
| [updateNameRegistry](functions/updateNameRegistry.md) | Builds an instruction to overwrite name registry data. |
| [updateRecord](functions/updateRecord.md) | Builds an instruction to update a record for a `.sns` domain or subdomain. |
| [validateRecordRoa](functions/validateRecordRoa.md) | Builds an instruction to validate a record's Right of Association with a Solana verifier. |
| [validateRecordRoaEthereum](functions/validateRecordRoaEthereum.md) | Builds an instruction to validate a record's Right of Association with an Ethereum signature. |
