---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getNameAccountKeySync

# Function: getNameAccountKeySync()

> **getNameAccountKeySync**(`hashed_name`, `nameClass?`, `nameParent?`): `PublicKey`

Defined in: [utils/getNameAccountKeySync.ts:18](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getNameAccountKeySync.ts#L18)

Derives a synchronous SPL Name Service account PDA from hashed name inputs.

## Parameters

### hashed\_name

`Buffer`

SNS seed hash for the account name

### nameClass?

`PublicKey`

Optional name class public key

### nameParent?

`PublicKey`

Optional parent name account public key

## Returns

`PublicKey`

Derived name-service account public key

## Example

```ts
const key = getNameAccountKeySync(getHashedNameSync("example"));
```
