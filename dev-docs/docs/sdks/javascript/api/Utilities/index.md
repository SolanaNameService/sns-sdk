---
title: "Utilities API"
sidebar_label: "Utilities"
hide_title: true
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../index.md) / Utilities

# Utilities

Low-level name-account, reverse-lookup, and TLD utilities.

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [SupportedTld](type-aliases/SupportedTld.md) | A top-level-domain suffix supported by SNS utilities. |

## Variables

| Variable | Description |
| ------ | ------ |
| [SNS\_TLD](variables/SNS_TLD.md) | The SNS top-level-domain suffix. |
| [SOL\_TLD](variables/SOL_TLD.md) | The Solana Name Service top-level-domain suffix. |
| [SUPPORTED\_TLDS](variables/SUPPORTED_TLDS.md) | TLD suffixes accepted by the current SDK configuration. |

## Functions

| Function | Description |
| ------ | ------ |
| [check](functions/check.md) | Throws `error` unless `bool` is true, preserving its concrete SNS error type. |
| [deserializeReverse](functions/deserializeReverse.md) | Decodes an SNS reverse-lookup account payload into a domain name. |
| [getArtistPubkey](functions/getArtistPubkey.md) | Returns the public key associated with a custom background. |
| [getCustomBgKeys](functions/getCustomBgKeys.md) | Derives the name account keys for a custom background. |
| [getHashedNameSync](functions/getHashedNameSync.md) | Hashes a name using the SNS name-service seed derivation. |
| [getNameAccountKeySync](functions/getNameAccountKeySync.md) | Derives a synchronous SPL Name Service account PDA from hashed name inputs. |
| [getPythFeedAccountKey](functions/getPythFeedAccountKey.md) | Derives a Pyth push-oracle price-feed account address from its shard and feed ID. |
| [getReverseKeyFromDomainKey](functions/getReverseKeyFromDomainKey.md) | Derives the reverse lookup account for a domain account. |
| [getReverseKeySync](functions/getReverseKeySync.md) | Derives the reverse lookup account for a domain name. |
| [getTld](functions/getTld.md) | Returns the matching TLD from `supportedTlds` if `domain` ends with one, or `undefined` otherwise. |
| [parseSnsTld](functions/parseSnsTld.md) | Validates that `domain` ends with `.sns`, strips that suffix, and returns a `[trimmedDomain, SNS_TLD]` tuple. |
| [parseSupportedTld](functions/parseSupportedTld.md) | Validates that `domain` ends with one of the `supportedTlds`, strips that suffix, and returns a `[trimmedDomain, tld]` tuple. |

## References

### reverseLookup

Re-exports [reverseLookup](../Domain/functions/reverseLookup.md)

***

### reverseLookupBatch

Re-exports [reverseLookupBatch](../Domain/functions/reverseLookupBatch.md)
