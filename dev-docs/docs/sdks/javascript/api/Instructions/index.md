---
title: "Instructions API"
sidebar_label: "Instructions"
hide_title: true
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../index.md) / Instructions

# Instructions

Low-level SPL Name Service and SNS instruction classes.

## Classes

| Class | Description |
| ------ | ------ |
| [BurnInstruction](classes/BurnInstruction.md) | Serializable registrar instruction for burning a registered domain. |
| [CreateReverseInstruction](classes/CreateReverseInstruction.md) | Serializable registrar instruction for creating a reverse-lookup registry. |
| [CreateSplitV2Instruction](classes/CreateSplitV2Instruction.md) | Serializable V2 registrar instruction for paid domain registration. |
| [CreateWithNftInstruction](classes/CreateWithNftInstruction.md) | Serializable registrar instruction for registration with an eligible NFT. |
| [SetPrimaryInstruction](classes/SetPrimaryInstruction.md) | Serializable registrar instruction for setting a wallet primary domain. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [AccountKey](interfaces/AccountKey.md) | Account metadata used when constructing a Solana transaction instruction. |
| [CreateReverseInstructionParams](interfaces/CreateReverseInstructionParams.md) | Input for creating a reverse-lookup registry. |
| [CreateSplitV2InstructionParams](interfaces/CreateSplitV2InstructionParams.md) | Input for paid V2 domain registration. |
| [CreateWithNftInstructionParams](interfaces/CreateWithNftInstructionParams.md) | Input for registration with an eligible NFT. |

## Functions

| Function | Description |
| ------ | ------ |
| [createInstruction](functions/createInstruction.md) | Builds an SPL Name Service instruction that creates a name registry account. |
| [deleteInstruction](functions/deleteInstruction.md) | Builds an SPL Name Service instruction that deletes a name registry account. |
| [reallocInstruction](functions/reallocInstruction.md) | Builds an SPL Name Service instruction that resizes a name registry account. |
| [transferInstruction](functions/transferInstruction.md) | Builds an SPL Name Service instruction that transfers a name registry owner. |
| [updateInstruction](functions/updateInstruction.md) | Builds an SPL Name Service instruction that writes bytes to a name registry. |
