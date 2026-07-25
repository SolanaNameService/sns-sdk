---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / getTld

# Function: getTld()

> **getTld**(`domain`, `supportedTlds?`): `string` \| `undefined`

Defined in: [utils/tld.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/tld.ts#L31)

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
