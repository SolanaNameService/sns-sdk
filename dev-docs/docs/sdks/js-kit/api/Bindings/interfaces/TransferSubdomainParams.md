---
displayed_sidebar: docsSidebar
---

[JS Kit SDK API Reference](../../index.md) / [Bindings](../index.md) / TransferSubdomainParams

# Interface: TransferSubdomainParams

Defined in: [bindings/transferSubdomain.ts:22](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/transferSubdomain.ts#L22)

Parameters for transferring an SNS subdomain.

## Example

```ts
const params: TransferSubdomainParams = {
  rpc,
  subdomain: "sub.example.sns",
  newOwner,
};
```

## Properties

### currentOwner?

> `optional` **currentOwner?**: `Address`

Defined in: [bindings/transferSubdomain.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/transferSubdomain.ts#L32)

Current subdomain owner. Resolved when omitted.

***

### isParentOwnerSigner?

> `optional` **isParentOwnerSigner?**: `boolean`

Defined in: [bindings/transferSubdomain.ts:30](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/transferSubdomain.ts#L30)

Whether the parent domain owner signs.

***

### newOwner

> **newOwner**: `Address`

Defined in: [bindings/transferSubdomain.ts:28](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/transferSubdomain.ts#L28)

New subdomain owner.

***

### rpc

> **rpc**: `Rpc`\<`GetAccountInfoApi`\>

Defined in: [bindings/transferSubdomain.ts:24](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/transferSubdomain.ts#L24)

RPC client.

***

### subdomain

> **subdomain**: `string`

Defined in: [bindings/transferSubdomain.ts:26](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js-kit/src/bindings/transferSubdomain.ts#L26)

Full `.sns` subdomain name.
