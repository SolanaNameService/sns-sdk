---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / parseSnsTld

# Function: parseSnsTld()

> **parseSnsTld**(`domain`): \[`string`, `string`\]

Defined in: [utils/tld.ts:74](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/utils/tld.ts#L74)

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
