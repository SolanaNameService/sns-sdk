---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Instructions](../index.md) / AccountKey

# Interface: AccountKey

Defined in: [instructions/types.ts:11](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/instructions/types.ts#L11)

Account metadata used when constructing a Solana transaction instruction.

## Example

```ts
const account: AccountKey = { pubkey: owner, isSigner: true, isWritable: false };
```

## Properties

### isSigner

> **isSigner**: `boolean`

Defined in: [instructions/types.ts:15](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/instructions/types.ts#L15)

Whether the account must sign the transaction.

***

### isWritable

> **isWritable**: `boolean`

Defined in: [instructions/types.ts:17](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/instructions/types.ts#L17)

Whether the instruction may modify the account.

***

### pubkey

> **pubkey**: `PublicKey`

Defined in: [instructions/types.ts:13](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/instructions/types.ts#L13)

Public key of the account.
