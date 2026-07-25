---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / registerDomain

# Function: registerDomain()

> **registerDomain**(`domain`, `space`, `buyer`, `buyerTokenAccount`, `mint?`, `referrerKey?`): `Promise`\<`TransactionInstruction`[]\>

Defined in: [bindings/registerDomain.ts:50](https://github.com/Bonfida/sns-sdk-beta/blob/c5f5eb8e0f323479c489bfc027c5ce38cc92f14f/js/src/bindings/registerDomain.ts#L50)

Builds the instructions to register a top-level `.sns` domain.

If a supported referrer is provided and its token account does not exist,
the returned instructions include an idempotent associated token account
creation instruction before the registration instruction.

## Parameters

### domain

`string`

Full `.sns` domain name

### space

`number`

The number of bytes to allocate for the domain name account

### buyer

`PublicKey`

Buyer paying for the registration

### buyerTokenAccount

`PublicKey`

The buyer's token account used to pay for registration

### mint?

`PublicKey` = `USDC_MINT`

The token mint used for payment, defaults to USDC

### referrerKey?

`PublicKey`

Optional public key of the referrer

## Returns

`Promise`\<`TransactionInstruction`[]\>

Transaction instructions.

## Example

```ts
const instructions = await registerDomain("example.sns", 1_000, buyer, buyerTokenAccount);
```
