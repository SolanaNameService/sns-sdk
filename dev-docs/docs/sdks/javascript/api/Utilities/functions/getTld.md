---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getTld

# Function: getTld()

> **getTld**(`domain`, `supportedTlds?`): `string` \| `undefined`

Defined in: [utils/tld.ts:28](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/tld.ts#L28)

Returns the matching TLD from `supportedTlds` if `domain` ends with one,
or `undefined` otherwise.

## Parameters

### domain

`string`

Domain name including an optional suffix

### supportedTlds?

readonly `string`[] = `SUPPORTED_TLDS`

Suffixes to match, defaulting to SDK-supported TLDs

## Returns

`string` \| `undefined`

The matching suffix, or `undefined`

## Example

```ts
const tld = getTld("example.sns");
```
