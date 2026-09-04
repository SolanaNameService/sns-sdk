---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / getSolDomainKeysForOwner

# Function: getSolDomainKeysForOwner()

> **getSolDomainKeysForOwner**(`connection`, `wallet`): `Promise`\<`PublicKey`[]\>

Defined in: [utils/getSolDomainKeysForOwner.ts:28](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSolDomainKeysForOwner.ts#L28)

Retrieves top-level `.sol` domain accounts owned by a wallet, excluding
expired domains.

## Parameters

### connection

`Connection`

Solana RPC connection

### wallet

`PublicKey`

Wallet to search domain accounts for

## Returns

`Promise`\<`PublicKey`[]\>

Public keys for non-expired domain accounts.

## Example

```ts
const keys = await getSolDomainKeysForOwner(connection, wallet);
```
