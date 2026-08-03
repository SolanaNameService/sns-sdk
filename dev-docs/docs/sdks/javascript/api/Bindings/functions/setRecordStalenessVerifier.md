---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Bindings](../index.md) / setRecordStalenessVerifier

# Function: setRecordStalenessVerifier()

> **setRecordStalenessVerifier**(`domain`, `record`, `owner`, `payer`, `verifier`): `TransactionInstruction`

Defined in: [bindings/setRecordStalenessVerifier.ts:21](https://github.com/Bonfida/sns-sdk-beta/blob/a8db17d4c6f4aa581dcca63f4ee93af53f6fe9ce/js/src/bindings/setRecordStalenessVerifier.ts#L21)

Builds an instruction to write or refresh staleness verifier metadata.

## Parameters

### domain

`string`

Full `.sns` domain or subdomain name

### record

[`Record`](../../Records/enumerations/Record.md)

Record type

### owner

`PublicKey`

Current owner of the domain

### payer

`PublicKey`

Fee payer for the instruction

### verifier

`PublicKey`

Verifier account used by the record validation instruction

## Returns

`TransactionInstruction`

Transaction instruction.

## Example

```ts
const instruction = setRecordStalenessVerifier("example.sns", Record.Url, owner, payer, verifier);
```
