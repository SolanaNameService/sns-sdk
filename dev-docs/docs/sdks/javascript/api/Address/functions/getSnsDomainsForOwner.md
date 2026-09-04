---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / getSnsDomainsForOwner

# Function: getSnsDomainsForOwner()

> **getSnsDomainsForOwner**(`connection`, `wallet`): `Promise`\<[`SnsDomain`](../interfaces/SnsDomain.md)[]\>

Defined in: [utils/getSnsDomainsForOwner.ts:39](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSnsDomainsForOwner.ts#L39)

Retrieves directly registry-owned top-level `.sns` domains for a wallet.

Tokenized domains and subdomains are not included.

## Parameters

### connection

`Connection`

Solana RPC connection

### wallet

`PublicKey`

Wallet whose directly registry-owned domains are retrieved

## Returns

`Promise`\<[`SnsDomain`](../interfaces/SnsDomain.md)[]\>

Domain records containing the domain name and its name account
public key

## Example

```ts
const domains = await getSnsDomainsForOwner(connection, wallet);
```
