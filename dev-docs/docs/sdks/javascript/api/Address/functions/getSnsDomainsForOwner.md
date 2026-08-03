---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / getSnsDomainsForOwner

# Function: getSnsDomainsForOwner()

> **getSnsDomainsForOwner**(`connection`, `wallet`): `Promise`\<[`SnsDomain`](../interfaces/SnsDomain.md)[]\>

Defined in: [utils/getSnsDomainsForOwner.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/utils/getSnsDomainsForOwner.ts#L37)

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
