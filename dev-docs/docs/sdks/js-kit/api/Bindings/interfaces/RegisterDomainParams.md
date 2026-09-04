---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / RegisterDomainParams

# Interface: RegisterDomainParams

Defined in: [bindings/registerDomain.ts:41](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomain.ts#L41)

Parameters for registering an SNS domain.

## Example

```ts
const params: RegisterDomainParams = {
  domain: "example.sns",
  space: 1_000,
  buyer,
  buyerTokenAccount,
};
```

## Properties

### buyer

> **buyer**: `Address`

Defined in: [bindings/registerDomain.ts:47](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomain.ts#L47)

Account paying for registration.

***

### buyerTokenAccount

> **buyerTokenAccount**: `Address`

Defined in: [bindings/registerDomain.ts:49](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomain.ts#L49)

Buyer's payment token account.

***

### domain

> **domain**: `string`

Defined in: [bindings/registerDomain.ts:43](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomain.ts#L43)

Full `.sns` domain name.

***

### mint?

> `optional` **mint?**: `Address`

Defined in: [bindings/registerDomain.ts:51](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomain.ts#L51)

Payment token mint. Defaults to USDC.

***

### referrer?

> `optional` **referrer?**: `Address`

Defined in: [bindings/registerDomain.ts:53](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomain.ts#L53)

Supported referrer address.

***

### space

> **space**: `number`

Defined in: [bindings/registerDomain.ts:45](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/js-kit/src/bindings/registerDomain.ts#L45)

Domain registry size in bytes.
