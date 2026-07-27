---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / getSnsDomainKeySync

# Function: getSnsDomainKeySync()

> **getSnsDomainKeySync**(`domain`, `record?`): [`SnsDomainKey`](../interfaces/SnsDomainKey.md)

Defined in: [utils/getSnsDomainKeySync.ts:59](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js/src/utils/getSnsDomainKeySync.ts#L59)

Derives an SNS namespace account from a TLD-trimmed domain name.

The caller must trim the TLD suffix before calling this function. For
example, pass `"example"` instead of `"example.sns"`, and pass
`"sub.example"` instead of `"sub.example.sns"`.

## Parameters

### domain

`string`

Domain name with its TLD suffix trimmed

### record?

[`RecordVersion`](../../Records/enumerations/RecordVersion.md)

Optional record version when deriving a record account

## Returns

[`SnsDomainKey`](../interfaces/SnsDomainKey.md)

Derived account key, name hash, and parent/subdomain metadata

## Throws

When the trimmed domain has unsupported nesting

## Example

```ts
const { pubkey } = getSnsDomainKeySync("example");
```
