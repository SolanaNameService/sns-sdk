---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getHashedNameSync

# Function: getHashedNameSync()

> **getHashedNameSync**(`name`): `Buffer`

Defined in: [utils/getHashedNameSync.ts:16](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getHashedNameSync.ts#L16)

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
