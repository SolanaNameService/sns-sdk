---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / getSolDomainsForOwner

# Function: getSolDomainsForOwner()

> **getSolDomainsForOwner**(`connection`, `wallet`): `Promise`\<[`SolDomain`](../interfaces/SolDomain.md)[]\>

Defined in: [utils/getSolDomainsForOwner.ts:51](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js/src/utils/getSolDomainsForOwner.ts#L51)

Retrieves directly registry-owned top-level `.sol` domains for a wallet,
excluding expired domains.

Tokenized domains are also excluded.

## Parameters

### connection

`Connection`

Solana RPC connection

### wallet

`PublicKey`

Wallet whose directly registry-owned domains are retrieved

## Returns

`Promise`\<[`SolDomain`](../interfaces/SolDomain.md)[]\>

Domain records containing the domain name and its name account
public key

## Example

```ts
const domains = await getSolDomainsForOwner(connection, wallet);
```
