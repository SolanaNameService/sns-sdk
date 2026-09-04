---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / getSnsDomainKeysForOwner

# Function: getSnsDomainKeysForOwner()

> **getSnsDomainKeysForOwner**(`connection`, `wallet`): `Promise`\<`PublicKey`[]\>

Defined in: [utils/getSnsDomainKeysForOwner.ts:16](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSnsDomainKeysForOwner.ts#L16)

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
