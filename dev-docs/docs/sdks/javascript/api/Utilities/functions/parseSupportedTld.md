---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / parseSupportedTld

# Function: parseSupportedTld()

> **parseSupportedTld**(`domain`, `supportedTlds?`): \[`string`, `string`\]

Defined in: [utils/tld.ts:50](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/tld.ts#L50)

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
