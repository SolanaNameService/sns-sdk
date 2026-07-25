---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / parseSnsTld

# Function: parseSnsTld()

> **parseSnsTld**(`domain`): \[`string`, `string`\]

Defined in: [utils/tld.ts:73](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js-kit/src/utils/tld.ts#L73)

Ensures `domain` ends with `.sns` and strips that suffix.

## Parameters

### domain

`string`

Domain name to parse

## Returns

\[`string`, `string`\]

Domain name without suffix and the `.sns` suffix.

## Throws

UnsupportedTldError If the domain does not end with `.sns`.

## Example

```ts
const [domain] = parseSnsTld("example.sns");
```
