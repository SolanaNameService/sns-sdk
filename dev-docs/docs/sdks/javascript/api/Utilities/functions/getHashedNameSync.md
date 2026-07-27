---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getHashedNameSync

# Function: getHashedNameSync()

> **getHashedNameSync**(`name`): `Buffer`

Defined in: [utils/getHashedNameSync.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/utils/getHashedNameSync.ts#L16)

Hashes a name using the SNS name-service seed derivation.

## Parameters

### name

`string`

Name or seed string to hash

## Returns

`Buffer`

SHA-256 name-service seed hash

## Example

```ts
const hash = getHashedNameSync("example");
```
