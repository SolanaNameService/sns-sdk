---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / RegisterPrimaryInstruction

# Class: RegisterPrimaryInstruction

Defined in: [instructions/registerPrimaryInstruction.ts:5](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/registerPrimaryInstruction.ts#L5)

Builder for registering an address's SNS primary domain.

## Constructors

### Constructor

> **new RegisterPrimaryInstruction**(): `RegisterPrimaryInstruction`

Defined in: [instructions/registerPrimaryInstruction.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/registerPrimaryInstruction.ts#L14)

#### Returns

`RegisterPrimaryInstruction`

## Properties

### tag

> **tag**: `number`

Defined in: [instructions/registerPrimaryInstruction.ts:7](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/registerPrimaryInstruction.ts#L7)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/registerPrimaryInstruction.ts:8](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/registerPrimaryInstruction.ts#L8)

#### struct

> **struct**: `object`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `nameAccount`, `primaryAccount`, `owner`, `systemProgram`, `optParent?`): `Instruction`

Defined in: [instructions/registerPrimaryInstruction.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/registerPrimaryInstruction.ts#L22)

#### Parameters

##### programAddress

`Address`

##### nameAccount

`Address`

##### primaryAccount

`Address`

##### owner

`Address`

##### systemProgram

`Address`

##### optParent?

`Address`

#### Returns

`Instruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/registerPrimaryInstruction.ts:18](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/registerPrimaryInstruction.ts#L18)

#### Returns

`Uint8Array`
