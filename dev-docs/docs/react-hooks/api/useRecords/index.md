---
title: "useRecords API"
sidebar_label: "useRecords"
hide_title: true
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../index.md) / useRecords

# useRecords

Verified SNS record queries and their public result types.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [UseRecordsOptions](interfaces/UseRecordsOptions.md) | Options for [useRecords](functions/useRecords.md). |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [VerifiedRecordResult](type-aliases/VerifiedRecordResult.md) | A record result that passed all applicable verification checks. |

## Functions

| Function | Description |
| ------ | ------ |
| [getVerifiedRecords](functions/getVerifiedRecords.md) | Retrieves records and removes entries that fail verification. |
| [useRecords](functions/useRecords.md) | Retrieves and verifies multiple records through React Query. |
