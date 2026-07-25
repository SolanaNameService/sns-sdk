---
title: "Records API"
sidebar_label: "Records"
hide_title: true
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../index.md) / Records

# Records

Record address derivation and verification APIs.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [GetRecordV1AddressParams](interfaces/GetRecordV1AddressParams.md) | Parameters for deriving a V1 record address. |
| [GetRecordV2AddressParams](interfaces/GetRecordV2AddressParams.md) | Parameters for deriving a V2 record address. |
| [VerifyRecordStalenessParams](interfaces/VerifyRecordStalenessParams.md) | Parameters for verifying record staleness. |

## Functions

| Function | Description |
| ------ | ------ |
| [\_getDefaultVerifier](functions/getDefaultVerifier.md) | Internal helper that derives the default verifier for a record state. |
| [\_verifyRoaSync](functions/verifyRoaSync.md) | Internal helper that verifies a record's Right of Association validation. |
| [\_verifyStalenessSync](functions/verifyStalenessSync.md) | Internal helper that verifies a record's staleness validation. |
| [getRecordV1Address](functions/getRecordV1Address.md) | Derives the address of a V1 record account. |
| [getRecordV2Address](functions/getRecordV2Address.md) | Derives the address of a V2 record account. |
| [verifyRecordRightOfAssociation](functions/verifyRecordRightOfAssociation.md) | Verifies a record's Right of Association validation. |
| [verifyRecordStaleness](functions/verifyRecordStaleness.md) | Verifies a record's staleness validation. |
