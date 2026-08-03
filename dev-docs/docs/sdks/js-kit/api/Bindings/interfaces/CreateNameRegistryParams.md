---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / CreateNameRegistryParams

# Interface: CreateNameRegistryParams

Defined in: [bindings/createNameRegistry.ts:25](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createNameRegistry.ts#L25)

Parameters for creating a name registry.

## Example

```ts
const params: CreateNameRegistryParams = { rpc, name: "example", space: 32, payer, owner };
```

## Properties

### classAddress?

> `optional` **classAddress?**: `Address`

Defined in: [bindings/createNameRegistry.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createNameRegistry.ts#L39)

Registry class address.

***

### lamports?

> `optional` **lamports?**: `bigint`

Defined in: [bindings/createNameRegistry.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createNameRegistry.ts#L37)

Account funding amount. Defaults to the rent-exempt minimum.

***

### name

> **name**: `string`

Defined in: [bindings/createNameRegistry.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createNameRegistry.ts#L29)

Raw registry name.

***

### owner

> **owner**: `Address`

Defined in: [bindings/createNameRegistry.ts:35](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createNameRegistry.ts#L35)

Owner of the new registry.

***

### parentAddress?

> `optional` **parentAddress?**: `Address`

Defined in: [bindings/createNameRegistry.ts:41](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createNameRegistry.ts#L41)

Parent registry address.

***

### payer

> **payer**: `Address`

Defined in: [bindings/createNameRegistry.ts:33](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createNameRegistry.ts#L33)

Account paying for creation.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi` & `GetMinimumBalanceForRentExemptionApi`\>

Defined in: [bindings/createNameRegistry.ts:27](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createNameRegistry.ts#L27)

RPC client.

***

### space

> **space**: `number`

Defined in: [bindings/createNameRegistry.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js-kit/src/bindings/createNameRegistry.ts#L31)

Account data size in bytes.
