---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / getSnsDomainKeysForOwner

# Function: getSnsDomainKeysForOwner()

> **getSnsDomainKeysForOwner**(`connection`, `wallet`): `Promise`\<`PublicKey`[]\>

Defined in: [utils/getSnsDomainKeysForOwner.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/utils/getSnsDomainKeysForOwner.ts#L16)

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
