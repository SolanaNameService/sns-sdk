---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / parseSupportedTld

# Function: parseSupportedTld()

> **parseSupportedTld**(`domain`, `supportedTlds?`): \[`string`, `string`\]

Defined in: [utils/tld.ts:47](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/tld.ts#L47)

Validates that `domain` ends with one of the `supportedTlds`, strips that
suffix, and returns a `[trimmedDomain, tld]` tuple.

## Parameters

### domain

`string`

Domain name including a supported suffix

### supportedTlds?

readonly `string`[] = `SUPPORTED_TLDS`

Suffixes accepted by this parse operation

## Returns

\[`string`, `string`\]

The TLD-trimmed domain and matching suffix

## Throws

When the domain does not end with a supported suffix

## Example

```ts
const [name, tld] = parseSupportedTld("example.sns");
```
