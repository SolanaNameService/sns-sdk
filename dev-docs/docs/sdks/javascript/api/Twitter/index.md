---
title: "Twitter API"
sidebar_label: "Twitter"
hide_title: true
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../index.md) / Twitter

# Twitter

Twitter registry lookup and management APIs.

## Classes

| Class | Description |
| ------ | ------ |
| [ReverseTwitterRegistryState](classes/ReverseTwitterRegistryState.md) | Deserialized reverse registry linking a verified key to a Twitter handle. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ReverseTwitterRegistryStateParams](interfaces/ReverseTwitterRegistryStateParams.md) | Input for decoding a reverse Twitter registry. |

## Functions

| Function | Description |
| ------ | ------ |
| [changeTwitterRegistryData](functions/changeTwitterRegistryData.md) | Builds an instruction that overwrites bytes in a verified Twitter registry. |
| [changeVerifiedPubkey](functions/changeVerifiedPubkey.md) | Builds instructions to transfer a Twitter handle to a new verified public key. |
| [createReverseTwitterRegistry](functions/createReverseTwitterRegistry.md) | Builds instructions to create the reverse registry for a verified Twitter handle. |
| [createVerifiedTwitterRegistry](functions/createVerifiedTwitterRegistry.md) | Builds instructions to create a verified Twitter handle registry and its reverse registry. |
| [deleteTwitterRegistry](functions/deleteTwitterRegistry.md) | Builds instructions to delete a verified Twitter handle registry and reverse registry. |
| [getHandleAndRegistryKey](functions/getHandleAndRegistryKey.md) | Retrieves a verified public key's Twitter handle and user-facing registry key. |
| [getTwitterHandleandRegistryKeyViaFilters](functions/getTwitterHandleandRegistryKeyViaFilters.md) | Retrieves a Twitter handle and registry key through an RPC program-account query. |
| [getTwitterRegistry](functions/getTwitterRegistry.md) | Retrieves the user-facing name registry for a Twitter handle. |
| [getTwitterRegistryData](functions/getTwitterRegistryData.md) | Retrieves raw user-facing registry data for a verified Twitter public key. |
| [getTwitterRegistryKey](functions/getTwitterRegistryKey.md) | Derives the user-facing name registry key for a Twitter handle. |
