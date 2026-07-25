---
title: "NFT API"
sidebar_label: "NFT"
hide_title: true
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../index.md) / NFT

# NFT

Tokenized-domain account, mint, owner, and state APIs.

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [Tag](enumerations/Tag.md) | Discriminator values used by name-tokenizer accounts. |

## Classes

| Class | Description |
| ------ | ------ |
| [NftRecord](classes/NftRecord.md) | Deserialized name-tokenizer record linking a name account to its NFT mint. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [NftRecordParams](interfaces/NftRecordParams.md) | Input for decoding a name-tokenizer record. |

## Variables

| Variable | Description |
| ------ | ------ |
| [MINT\_PREFIX](variables/MINT_PREFIX.md) | PDA seed prefix for tokenized SNS domain mints. |
| [NAME\_TOKENIZER\_ID](variables/NAME_TOKENIZER_ID.md) | Program ID for the SNS name-tokenizer program. |

## Functions

| Function | Description |
| ------ | ------ |
| [getDomainMint](functions/getDomainMint.md) | Derives the NFT mint PDA for a tokenized SNS name account. |
| [getRecordFromMint](functions/getRecordFromMint.md) | Retrieves NFT records for a domain mint. |
| [retrieveNftOwner](functions/retrieveNftOwner.md) | Retrieves the owner of a tokenized domain name. |
| [retrieveNftOwnerV2](functions/retrieveNftOwnerV2.md) | Retrieves the owner of a tokenized name using the mint's largest token account. |
| [retrieveNfts](functions/retrieveNfts.md) | Retrieves all tokenized domain name accounts. |
| [retrieveRecords](functions/retrieveRecords.md) | Retrieves active SNS NFT records for tokenized domains owned by a wallet. |
