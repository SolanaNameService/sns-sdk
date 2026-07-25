---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Utilities](../index.md) / deserializeReverse

# Function: deserializeReverse()

Decodes an SNS reverse-lookup account payload into a domain name.

## Param

**data**

Encoded reverse-lookup account payload

## Param

**trimFirstNullByte**

Whether to remove the leading subdomain marker

## Example

```ts
const name = deserializeReverse(reverseAccountData);
```

## Call Signature

> **deserializeReverse**(`data`, `trimFirstNullByte?`): `string`

Defined in: [utils/deserializeReverse.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/utils/deserializeReverse.ts#L15)

Decodes an SNS reverse-lookup account payload into a domain name.

### Parameters

#### data

`Buffer`

Encoded reverse-lookup account payload

#### trimFirstNullByte?

`boolean`

Whether to remove the leading subdomain marker

### Returns

`string`

The decoded domain name

### Example

```ts
const name = deserializeReverse(reverseAccountData);
```

## Call Signature

> **deserializeReverse**(`data`, `trimFirstNullByte?`): `undefined`

Defined in: [utils/deserializeReverse.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/utils/deserializeReverse.ts#L24)

Decodes an absent reverse-lookup payload to `undefined`.

### Parameters

#### data

`undefined`

#### trimFirstNullByte?

`boolean`

### Returns

`undefined`

`undefined`
