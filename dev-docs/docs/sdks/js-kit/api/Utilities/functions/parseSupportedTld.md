---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / parseSupportedTld

# Function: parseSupportedTld()

> **parseSupportedTld**(`domain`, `supportedTlds?`): \[`string`, `string`\]

Defined in: [utils/tld.ts:46](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/utils/tld.ts#L46)

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
