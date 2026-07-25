---
title: "Instructions API"
sidebar_label: "Instructions"
hide_title: true
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../index.md) / Instructions

# Instructions

Low-level SNS instruction classes and instruction helpers.

## Classes

| Class | Description |
| ------ | ------ |
| [AllocateAndPostRecordInstruction](classes/AllocateAndPostRecordInstruction.md) | Builder for allocating and writing an SNS V2 record account. |
| [BurnDomainInstruction](classes/BurnDomainInstruction.md) | Builder for burning an SNS domain NFT and registry account. |
| [CreateNameRegistryInstruction](classes/CreateNameRegistryInstruction.md) | Builder for creating an SNS name-registry account. |
| [CreateReverseInstruction](classes/CreateReverseInstruction.md) | Builder for creating an SNS reverse-lookup account. |
| [CreateSplitV2Instruction](classes/CreateSplitV2Instruction.md) | Builder for creating a split SNS V2 domain account. |
| [CreateWithNftInstruction](classes/CreateWithNftInstruction.md) | Builder for registering an SNS domain backed by an NFT. |
| [DeleteNameRegistryInstruction](classes/DeleteNameRegistryInstruction.md) | Builder for deleting an SNS name-registry account. |
| [DeleteRecordInstruction](classes/DeleteRecordInstruction.md) | Builder for deleting an SNS V2 record account. |
| [ReallocInstruction](classes/ReallocInstruction.md) | Builder for reallocating an SNS name-registry account. |
| [RegisterPrimaryInstruction](classes/RegisterPrimaryInstruction.md) | Builder for registering an address's SNS primary domain. |
| [SetRecordRoaVerifierInstruction](classes/SetRecordRoaVerifierInstruction.md) | Builder for setting an SNS record's Right of Association verifier. |
| [TransferInstruction](classes/TransferInstruction.md) | Builder for the SNS name-registry transfer instruction. |
| [UpdateNameRegistryInstruction](classes/UpdateNameRegistryInstruction.md) | Builder for updating the data of an SNS name-registry account. |
| [UpdateRecordInstruction](classes/UpdateRecordInstruction.md) | Builder for updating content in an SNS V2 record account. |
| [ValidateEthereumSignatureInstruction](classes/ValidateEthereumSignatureInstruction.md) | Builder for validating an Ethereum signature for an SNS record. |
| [ValidateSolanaSignatureInstruction](classes/ValidateSolanaSignatureInstruction.md) | Builder for validating a Solana signature for an SNS record. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [AllocateAndPostRecordInstructionParams](interfaces/AllocateAndPostRecordInstructionParams.md) | Input for allocating and writing an SNS V2 record. |
| [CreateNameRegistryInstructionParams](interfaces/CreateNameRegistryInstructionParams.md) | Input for creating an SNS name-registry account. |
| [CreateReverseInstructionParams](interfaces/CreateReverseInstructionParams.md) | Input for creating an SNS reverse-lookup account. |
| [CreateSplitV2InstructionParams](interfaces/CreateSplitV2InstructionParams.md) | Input for creating a split SNS V2 domain account. |
| [CreateWithNftInstructionParams](interfaces/CreateWithNftInstructionParams.md) | Input for registering an SNS domain backed by an NFT. |
| [ReallocInstructionParams](interfaces/ReallocInstructionParams.md) | Input for reallocating an SNS name-registry account. |
| [SetRecordRoaVerifierInstructionParams](interfaces/SetRecordRoaVerifierInstructionParams.md) | Input for setting an SNS record's Right of Association verifier. |
| [TransferInstructionParams](interfaces/TransferInstructionParams.md) | Input for transferring an SNS name-registry account. |
| [UpdateNameRegistryInstructionParams](interfaces/UpdateNameRegistryInstructionParams.md) | Input for updating an SNS name-registry account. |
| [UpdateRecordInstructionParams](interfaces/UpdateRecordInstructionParams.md) | Input for updating an SNS V2 record account. |
| [ValidateEthereumSignatureInstructionParams](interfaces/ValidateEthereumSignatureInstructionParams.md) | Input for validating an Ethereum signature for an SNS record. |
| [ValidateSolanaSignatureInstructionParams](interfaces/ValidateSolanaSignatureInstructionParams.md) | Input for validating a Solana signature for an SNS record. |

## Functions

| Function | Description |
| ------ | ------ |
| [\_createAtaIdempotentInstruction](functions/createAtaIdempotentInstruction.md) | Creates an idempotent associated-token-account instruction. |
