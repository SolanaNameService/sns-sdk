---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / getSrsRecordSeed

# Function: getSrsRecordSeed()

> **getSrsRecordSeed**(`name`): `Buffer`

Defined in: [utils/getSolDomainKeySync.ts:19](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSolDomainKeySync.ts#L19)

Encodes a TLD-trimmed `.sol` domain name as the current SRS record seed.

## Parameters

### name

`string`

Domain name with the `.sol` TLD suffix trimmed

## Returns

`Buffer`

UTF-8 bytes used as the SRS record PDA seed

## Example

```ts
const seed: Buffer = getSrsRecordSeed("example");
```
