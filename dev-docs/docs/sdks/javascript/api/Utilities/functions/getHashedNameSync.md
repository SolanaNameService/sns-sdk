---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getHashedNameSync

# Function: getHashedNameSync()

> **getHashedNameSync**(`name`): `Buffer`

Defined in: [utils/getHashedNameSync.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/utils/getHashedNameSync.ts#L16)

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
