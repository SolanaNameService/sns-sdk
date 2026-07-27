---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Instructions](../index.md) / BurnDomainInstruction

# Class: BurnDomainInstruction

Defined in: [instructions/burnDomainInstruction.ts:5](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/burnDomainInstruction.ts#L5)

Builder for burning an SNS domain NFT and registry account.

## Constructors

### Constructor

> **new BurnDomainInstruction**(): `BurnDomainInstruction`

Defined in: [instructions/burnDomainInstruction.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/burnDomainInstruction.ts#L15)

#### Returns

`BurnDomainInstruction`

## Properties

### tag

> **tag**: `number`

Defined in: [instructions/burnDomainInstruction.ts:7](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/burnDomainInstruction.ts#L7)

Instruction discriminator.

***

### schema

> `static` **schema**: `object`

Defined in: [instructions/burnDomainInstruction.ts:9](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/burnDomainInstruction.ts#L9)

#### struct

> **struct**: `object`

##### struct.tag

> **tag**: `string` = `"u8"`

## Methods

### getInstruction()

> **getInstruction**(`programAddress`, `nameServiceId`, `systemProgram`, `domainAddress`, `reverse`, `resellingState`, `state`, `centralState`, `owner`, `target`): `Instruction`

Defined in: [instructions/burnDomainInstruction.ts:23](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/burnDomainInstruction.ts#L23)

#### Parameters

##### programAddress

`Address`

##### nameServiceId

`Address`

##### systemProgram

`Address`

##### domainAddress

`Address`

##### reverse

`Address`

##### resellingState

`Address`

##### state

`Address`

##### centralState

`Address`

##### owner

`Address`

##### target

`Address`

#### Returns

`Instruction`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [instructions/burnDomainInstruction.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/2fdbcacbd9670d538f5137e9d196a9ca079923fa/js-kit/src/instructions/burnDomainInstruction.ts#L19)

#### Returns

`Uint8Array`
