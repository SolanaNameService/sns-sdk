---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / getSnsDomainKeysForOwner

# Function: getSnsDomainKeysForOwner()

> **getSnsDomainKeysForOwner**(`connection`, `wallet`): `Promise`\<`PublicKey`[]\>

Defined in: [utils/getSnsDomainKeysForOwner.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/utils/getSnsDomainKeysForOwner.ts#L16)

Retrieves top-level `.sns` domain accounts owned by a wallet.

## Parameters

### connection

`Connection`

Solana RPC connection

### wallet

`PublicKey`

Wallet to search domain accounts for

## Returns

`Promise`\<`PublicKey`[]\>

Domain account public keys.

## Example

```ts
const keys = await getSnsDomainKeysForOwner(connection, wallet);
```
