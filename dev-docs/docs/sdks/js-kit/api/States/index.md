---
title: "States API"
sidebar_label: "States"
hide_title: true
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../index.md) / States

# States

Public account-state models and deserializers.

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [NftTag](enumerations/NftTag.md) | Tags identifying the SNS NFT state variant. |

## Classes

| Class | Description |
| ------ | ------ |
| [NftState](classes/NftState.md) | Decoded state of an SNS NFT account. |
| [PrimaryDomainState](classes/PrimaryDomainState.md) | Decoded state of an SNS primary-domain account. |
| [RecordHeaderState](classes/RecordHeaderState.md) | Decoded header of an SNS V2 record account. |
| [RecordState](classes/RecordState.md) | Decoded SNS V2 record account, including its validation data and content. |
| [RegistryState](classes/RegistryState.md) | Decoded state of an SNS name-registry account. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [NftStateParams](interfaces/NftStateParams.md) | Input for decoding an SNS NFT account. |
| [PrimaryDomainStateParams](interfaces/PrimaryDomainStateParams.md) | Input for decoding an SNS primary-domain account. |
| [RecordHeaderStateParams](interfaces/RecordHeaderStateParams.md) | Input for decoding an SNS V2 record header. |
| [RegistryStateParams](interfaces/RegistryStateParams.md) | Input for decoding an SNS name-registry account. |

## Variables

| Variable | Description |
| ------ | ------ |
| [NAME\_REGISTRY\_LEN](variables/NAME_REGISTRY_LEN.md) | Byte length of the common SNS name-registry account header. |

## Functions

| Function | Description |
| ------ | ------ |
| [getValidationLength](functions/getValidationLength.md) | Returns the byte length of an identifier encoded for a validation mode. |
