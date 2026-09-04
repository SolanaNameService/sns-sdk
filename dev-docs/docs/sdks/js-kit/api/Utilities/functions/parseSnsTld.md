---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / parseSnsTld

# Function: parseSnsTld()

> **parseSnsTld**(`domain`): \[`string`, `string`\]

Defined in: [utils/tld.ts:71](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/utils/tld.ts#L71)

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
