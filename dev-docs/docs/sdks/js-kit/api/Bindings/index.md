---
title: "Bindings API"
sidebar_label: "Bindings"
hide_title: true
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../index.md) / Bindings

# Bindings

High-level builders for SNS transaction instructions.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [BurnDomainParams](interfaces/BurnDomainParams.md) | Parameters for burning an SNS domain. |
| [CreateNameRegistryParams](interfaces/CreateNameRegistryParams.md) | Parameters for creating a name registry. |
| [CreateRecordParams](interfaces/CreateRecordParams.md) | Parameters for creating a domain record. |
| [CreateReverseParams](interfaces/CreateReverseParams.md) | Parameters for creating a reverse lookup record. |
| [CreateSubdomainParams](interfaces/CreateSubdomainParams.md) | Parameters for creating an SNS subdomain. |
| [DeleteNameRegistryParams](interfaces/DeleteNameRegistryParams.md) | Parameters for deleting a name registry. |
| [DeleteRecordParams](interfaces/DeleteRecordParams.md) | Parameters for deleting a domain record. |
| [RecordVerificationParams](interfaces/RecordVerificationParams.md) | Accounts and record identity required to build a record-validation instruction. |
| [RegisterDomainParams](interfaces/RegisterDomainParams.md) | Parameters for registering an SNS domain. |
| [RegisterDomainWithNftParams](interfaces/RegisterDomainWithNftParams.md) | Parameters for registering an SNS domain with an NFT. |
| [SetPrimaryDomainParams](interfaces/SetPrimaryDomainParams.md) | Input for setting an owner's already-derived SNS primary domain. |
| [TransferDomainParams](interfaces/TransferDomainParams.md) | Parameters for transferring an SNS domain. |
| [TransferSubdomainParams](interfaces/TransferSubdomainParams.md) | Parameters for transferring an SNS subdomain. |
| [UpdateNameRegistryParams](interfaces/UpdateNameRegistryParams.md) | Input for updating bytes in a raw SNS name-registry account. |
| [UpdateRecordParams](interfaces/UpdateRecordParams.md) | Parameters for updating a domain record. |
| [ValidateRecordRoaEthereumParams](interfaces/ValidateRecordRoaEthereumParams.md) | Parameters for validating a record with an Ethereum signature. |

## Functions

| Function | Description |
| ------ | ------ |
| [burnDomain](functions/burnDomain.md) | Builds an instruction to burn a top-level `.sns` domain. |
| [createNameRegistry](functions/createNameRegistry.md) | Creates a raw SPL Name Registry account with the given rent budget, allocated space, owner, and class. |
| [createRecord](functions/createRecord.md) | Builds an instruction to create a V2 record for a `.sns` domain or subdomain. |
| [createReverse](functions/createReverse.md) | Creates a raw reverse lookup record for the specified domain account. |
| [createSubdomain](functions/createSubdomain.md) | Builds the instructions to create a `.sns` subdomain. |
| [deleteNameRegistry](functions/deleteNameRegistry.md) | Deletes a raw SPL Name Registry account and refunds the associated rent balance to the specified target. |
| [deleteRecord](functions/deleteRecord.md) | Builds an instruction to delete a V2 record for a `.sns` domain or subdomain. |
| [registerDomain](functions/registerDomain.md) | Builds the instructions to register a top-level `.sns` domain. |
| [registerDomainWithNft](functions/registerDomainWithNft.md) | Builds an instruction to register a top-level `.sns` domain using a Bonfida Wolves NFT. |
| [setPrimaryDomain](functions/setPrimaryDomain.md) | Sets the primary domain for the specified owner. |
| [setRecordRoaVerifier](functions/setRecordRoaVerifier.md) | Builds an instruction to store the expected Right of Association verifier for a V2 record. |
| [setRecordStalenessVerifier](functions/setRecordStalenessVerifier.md) | Builds an instruction to write or refresh staleness verifier metadata for a V2 record. |
| [transferDomain](functions/transferDomain.md) | Builds an instruction to transfer a top-level `.sns` domain. |
| [transferSubdomain](functions/transferSubdomain.md) | Builds an instruction to transfer a `.sns` subdomain. |
| [updateNameRegistry](functions/updateNameRegistry.md) | Updates the data of a raw SPL Name Registry account. |
| [updateRecord](functions/updateRecord.md) | Builds an instruction to update a V2 record for a `.sns` domain or subdomain. |
| [validateRecordRoa](functions/validateRecordRoa.md) | Builds an instruction to validate a V2 record's Right of Association with a Solana verifier. |
| [validateRecordRoaEthereum](functions/validateRecordRoaEthereum.md) | Builds an instruction to validate a V2 record's Right of Association with an Ethereum signature. |
