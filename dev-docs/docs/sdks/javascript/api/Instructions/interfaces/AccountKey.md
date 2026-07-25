---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Instructions](../index.md) / AccountKey

# Interface: AccountKey

Defined in: [instructions/types.ts:11](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/types.ts#L11)

Account metadata used when constructing a Solana transaction instruction.

## Example

```ts
const account: AccountKey = { pubkey: owner, isSigner: true, isWritable: false };
```

## Properties

### isSigner

> **isSigner**: `boolean`

Defined in: [instructions/types.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/types.ts#L15)

Whether the account must sign the transaction.

***

### isWritable

> **isWritable**: `boolean`

Defined in: [instructions/types.ts:17](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/types.ts#L17)

Whether the instruction may modify the account.

***

### pubkey

> **pubkey**: `PublicKey`

Defined in: [instructions/types.ts:13](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/instructions/types.ts#L13)

Public key of the account.
