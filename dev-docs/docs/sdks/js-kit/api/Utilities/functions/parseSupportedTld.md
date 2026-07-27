---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / parseSupportedTld

# Function: parseSupportedTld()

> **parseSupportedTld**(`domain`, `supportedTlds?`): \[`string`, `string`\]

Defined in: [utils/tld.ts:48](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/tld.ts#L48)

Ensures `domain` ends with one of the `supportedTlds` and strips that suffix.

## Parameters

### domain

`string`

Domain name to parse

### supportedTlds?

readonly `string`[] = `SUPPORTED_TLDS`

Supported suffixes to match against

## Returns

\[`string`, `string`\]

Domain name without suffix and the matching suffix.

## Throws

UnsupportedTldError If no supported suffix matches.

## Example

```ts
const [domain, tld] = parseSupportedTld("example.sns");
```
