---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Errors](../index.md) / CouldNotFindNftOwner

# Class: CouldNotFindNftOwner

Defined in: [error.ts:205](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/error.ts#L205)

Base error for SDK failures, carrying a machine-readable [ErrorType](../enumerations/ErrorType.md).

## Extends

- [`SNSError`](SNSError.md)

## Constructors

### Constructor

> **new CouldNotFindNftOwner**(`message?`): `CouldNotFindNftOwner`

Defined in: [error.ts:206](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/error.ts#L206)

#### Parameters

##### message?

`string`

#### Returns

`CouldNotFindNftOwner`

#### Overrides

[`SNSError`](SNSError.md).[`constructor`](SNSError.md#constructor)

## Properties

### type

> **type**: [`ErrorType`](../enumerations/ErrorType.md)

Defined in: [error.ts:43](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/error.ts#L43)

Machine-readable error category.

#### Inherited from

[`SNSError`](SNSError.md).[`type`](SNSError.md#type)
