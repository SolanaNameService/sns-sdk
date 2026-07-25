---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Integer utilities](../index.md) / Numberu32

# Class: Numberu32

Defined in: [int.ts:8](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L8)

Unsigned 32-bit integer wrapper for SPL Name Service instruction encoding.

## Constructors

### Constructor

> **new Numberu32**(`value`): `Numberu32`

Defined in: [int.ts:12](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L12)

#### Parameters

##### value

`string` \| `number` \| `bigint`

#### Returns

`Numberu32`

## Properties

### value

> **value**: `bigint`

Defined in: [int.ts:10](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L10)

Wrapped unsigned integer value.

## Methods

### toBuffer()

> **toBuffer**(): `Buffer`

Defined in: [int.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L19)

Convert to Buffer representation

#### Returns

`Buffer`

***

### toNumber()

> **toNumber**(): `number`

Defined in: [int.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L39)

#### Returns

`number`

***

### toString()

> **toString**(): `string`

Defined in: [int.ts:43](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L43)

#### Returns

`string`

***

### fromBuffer()

> `static` **fromBuffer**(`buffer`): `Numberu32`

Defined in: [int.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/int.ts#L28)

Construct a Numberu32 from Buffer representation

#### Parameters

##### buffer

`Buffer`

#### Returns

`Numberu32`
