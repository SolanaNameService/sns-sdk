---
title: "Records API"
sidebar_label: "Records"
hide_title: true
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../index.md) / Records

# Records

Record reads, key derivation, validation, and content codecs.

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [Record](enumerations/Record.md) | Supported SNS record identifiers. |
| [RecordVersion](enumerations/RecordVersion.md) | Supported SNS record account layouts. |
| [Validation](enumerations/Validation.md) | On-chain record validation scheme identifiers. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [GetMultipleRecordsOptions](interfaces/GetMultipleRecordsOptions.md) | Options controlling content decoding for [getMultipleRecords](functions/getMultipleRecords.md). |
| [GetRecordOptions](interfaces/GetRecordOptions.md) | Options controlling content decoding for [getRecord](functions/getRecord.md). |
| [RecordResult](interfaces/RecordResult.md) | Result returned by [getRecord](functions/getRecord.md) and by defined entries from [getMultipleRecords](functions/getMultipleRecords.md). |
| [RetrievedRecord](interfaces/RetrievedRecord.md) | Raw SNS record account data returned by the records program. |

## Variables

| Variable | Description |
| ------ | ------ |
| [ETH\_ROA\_RECORDS](variables/ETH_ROA_RECORDS.md) | Record types that use secp256k1 verification. |
| [EVM\_RECORDS](variables/EVM_RECORDS.md) | Record types whose values use EVM address encoding. |
| [GUARDIANS](variables/GUARDIANS.md) | Maps record types to their guardian public keys. |
| [RECORD\_V1\_SIZE](variables/RECORD_V1_SIZE.md) | Fixed byte lengths for V1 record payloads. |
| [SELF\_SIGNED](variables/SELF_SIGNED.md) | Record types self-signed by the public key in their content. |
| [UTF8\_ENCODED](variables/UTF8_ENCODED.md) | Record types encoded as UTF-8 strings. |

## Functions

| Function | Description |
| ------ | ------ |
| [deserializeRecordContent](functions/deserializeRecordContent.md) | Deserializes record content according to SNS-IP 1. |
| [getMultipleRecords](functions/getMultipleRecords.md) | Retrieves multiple records for a domain, verifies the staleness and right of association of each, and optionally deserializes their content. |
| [getRecord](functions/getRecord.md) | Retrieves a record for a domain, verifies its staleness and right of association, and optionally deserializes the record content. |
| [getRecordV1Key](functions/getRecordV1Key.md) | Derives the legacy V1 record account key. |
| [getRecordV2Key](functions/getRecordV2Key.md) | Derives the V2 record account key. |
| [serializeRecordContent](functions/serializeRecordContent.md) | Serializes record content according to SNS-IP 1. |
| [verifyRightOfAssociation](functions/verifyRightOfAssociation.md) | Verifies a record's Right of Association validation. |
| [verifyStaleness](functions/verifyStaleness.md) | Verifies a record's staleness validation. |
