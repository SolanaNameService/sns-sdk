---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / parseSnsTld

# Function: parseSnsTld()

> **parseSnsTld**(`domain`): \[`string`, `string`\]

Defined in: [utils/tld.ts:73](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/utils/tld.ts#L73)

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
