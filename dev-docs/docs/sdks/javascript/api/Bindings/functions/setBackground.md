---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / setBackground

# Function: setBackground()

> **setBackground**(`connection`, `domain`, `bg`, `owner`): `Promise`\<`TransactionInstruction`[]\>

Defined in: [bindings/setBackground.ts:36](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/bindings/setBackground.ts#L36)

Builds the instructions to set an issued custom background for a top-level `.sns` domain.

## Parameters

### connection

`Connection`

Solana RPC connection

### domain

`string`

Full `.sns` domain name

### bg

[`CustomBg`](../../Types/enumerations/CustomBg.md)

The issued custom background to set

### owner

`PublicKey`

Current owner of the domain

## Returns

`Promise`\<`TransactionInstruction`[]\>

Transaction instructions.

## Example

```ts
const instructions = await setBackground(connection, "example.sns", CustomBg.DegenPoet1, owner);
```
