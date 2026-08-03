---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Utilities](../index.md) / getTld

# Function: getTld()

> **getTld**(`domain`, `supportedTlds?`): `string` \| `undefined`

Defined in: [utils/tld.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/utils/tld.ts#L30)

Returns the matching TLD from `supportedTlds` if `domain` ends with one,
or `undefined` otherwise.

## Parameters

### domain

`string`

Domain name to inspect

### supportedTlds?

readonly `string`[] = `SUPPORTED_TLDS`

Supported suffixes to match against

## Returns

`string` \| `undefined`

The matching suffix, or `undefined` when none match.

## Example

```ts
const tld = getTld("example.sns");
```
