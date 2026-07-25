---
title: "Utilities API"
sidebar_label: "Utilities"
hide_title: true
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../index.md) / Utilities

# Utilities

Low-level address, serialization, reverse-lookup, and TLD utilities.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [DeserializeRecordContentParams](interfaces/DeserializeRecordContentParams.md) | Parameters for deserializing record content. |
| [DeserializeReverseParams](interfaces/DeserializeReverseParams.md) | Parameters for deserializing reverse account data. |
| [GetPythFeedAddressParams](interfaces/GetPythFeedAddressParams.md) | Parameters for deriving a Pyth feed address. |
| [GetReverseAddressFromDomainAddressParams](interfaces/GetReverseAddressFromDomainAddressParams.md) | Parameters for deriving a reverse lookup address. |
| [ReverseLookupBatchParams](interfaces/ReverseLookupBatchParams.md) | Parameters for batch reverse lookup. |
| [ReverseLookupParams](interfaces/ReverseLookupParams.md) | Parameters for reverse lookup. |
| [SerializeRecordContentParams](interfaces/SerializeRecordContentParams.md) | Parameters for serializing record content. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [SupportedTld](type-aliases/SupportedTld.md) | A top-level domain supported by this SDK. |

## Variables

| Variable | Description |
| ------ | ------ |
| [SNS\_TLD](variables/SNS_TLD.md) | The Bonfida SNS top-level domain. |
| [SOL\_TLD](variables/SOL_TLD.md) | The Solana Name Service top-level domain. |
| [SUPPORTED\_TLDS](variables/SUPPORTED_TLDS.md) | TLD suffixes accepted by the domain parsing and resolution helpers. |

## Functions

| Function | Description |
| ------ | ------ |
| [checkAddressOnCurve](functions/checkAddressOnCurve.md) | Returns whether a Solana address represents a valid Ed25519 curve point. |
| [deserializeRecordContent](functions/deserializeRecordContent.md) | Deserializes record content according to SNS-IP 1. |
| [deserializeReverse](functions/deserializeReverse.md) | Deserializes reverse account data. |
| [getPythFeedAddress](functions/getPythFeedAddress.md) | Derives the Pyth feed PDA for a shard and price feed. |
| [getReverseAddress](functions/getReverseAddress.md) | Derives the reverse lookup account address for a TLD-trimmed SNS domain. |
| [getReverseAddressFromDomainAddress](functions/getReverseAddressFromDomainAddress.md) | Derives the reverse lookup account address from a domain address. |
| [getTld](functions/getTld.md) | Returns the matching TLD from `supportedTlds` if `domain` ends with one, or `undefined` otherwise. |
| [parseSnsTld](functions/parseSnsTld.md) | Ensures `domain` ends with `.sns` and strips that suffix. |
| [parseSupportedTld](functions/parseSupportedTld.md) | Ensures `domain` ends with one of the `supportedTlds` and strips that suffix. |
| [reverseLookup](functions/reverseLookup.md) | Performs a reverse lookup for a domain address. |
| [reverseLookupBatch](functions/reverseLookupBatch.md) | Performs reverse lookups for domain addresses. |
| [serializeRecordContent](functions/serializeRecordContent.md) | Serializes record content according to SNS-IP 1. |
