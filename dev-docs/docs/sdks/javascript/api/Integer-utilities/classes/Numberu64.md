---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Integer utilities](../index.md) / Numberu64

# Class: Numberu64

Defined in: [int.ts:49](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L49)

Unsigned 64-bit integer wrapper for SPL Name Service instruction encoding.

## Constructors

### Constructor

> **new Numberu64**(`value`): `Numberu64`

Defined in: [int.ts:53](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L53)

#### Parameters

##### value

`string` \| `number` \| `bigint`

#### Returns

`Numberu64`

## Properties

### value

> **value**: `bigint`

Defined in: [int.ts:51](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L51)

Wrapped unsigned integer value.

## Methods

### toBuffer()

> **toBuffer**(): `Buffer`

Defined in: [int.ts:60](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L60)

Convert to Buffer representation

#### Returns

`Buffer`

***

### toNumber()

> **toNumber**(): `number`

Defined in: [int.ts:78](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L78)

#### Returns

`number`

***

### toString()

> **toString**(): `string`

Defined in: [int.ts:82](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L82)

#### Returns

`string`

***

### fromBuffer()

> `static` **fromBuffer**(`buffer`): `Numberu64`

Defined in: [int.ts:69](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L69)

Construct a Numberu64 from Buffer representation

#### Parameters

##### buffer

`Buffer`

#### Returns

`Numberu64`
