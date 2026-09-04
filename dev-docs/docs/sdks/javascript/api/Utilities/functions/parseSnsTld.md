---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / parseSnsTld

# Function: parseSnsTld()

> **parseSnsTld**(`domain`): \[`string`, `string`\]

Defined in: [utils/tld.ts:71](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/tld.ts#L71)

Validates that `domain` ends with `.sns`, strips that suffix, and returns a
`[trimmedDomain, SNS_TLD]` tuple.

## Parameters

### domain

`string`

Domain name including the `.sns` suffix

## Returns

\[`string`, `string`\]

The TLD-trimmed domain and `.sns`

## Throws

When the domain does not end with `.sns`

## Example

```ts
const [name] = parseSnsTld("example.sns");
```
