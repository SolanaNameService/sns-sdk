---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / RecordVerificationParams

# Interface: RecordVerificationParams

Defined in: [bindings/recordValidation.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/recordValidation.ts#L29)

Accounts and record identity required to build a record-validation instruction.

## Example

```ts
const params: RecordVerificationParams = {
  domain: "example.sns",
  record: Record.Url,
  owner,
  payer,
  verifier,
};
```

## Properties

### domain

> **domain**: `string`

Defined in: [bindings/recordValidation.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/recordValidation.ts#L31)

Full `.sns` domain or subdomain name.

***

### owner

> **owner**: `Address`

Defined in: [bindings/recordValidation.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/recordValidation.ts#L37)

Current owner of the domain.

***

### payer

> **payer**: `Address`

Defined in: [bindings/recordValidation.ts:40](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/recordValidation.ts#L40)

Fee payer for the validation instruction.

***

### record

> **record**: [`Record`](../../Types/enumerations/Record.md)

Defined in: [bindings/recordValidation.ts:34](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/recordValidation.ts#L34)

V2 record type to validate.

***

### verifier

> **verifier**: `Address`

Defined in: [bindings/recordValidation.ts:43](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/recordValidation.ts#L43)

Account whose signature or identity verifies the record.
