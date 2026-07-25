---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Address](../index.md) / SnsDomain

# Interface: SnsDomain

Defined in: [utils/getSnsDomainsForOwner.ts:14](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsDomainsForOwner.ts#L14)

A directly registry-owned top-level SNS domain.

## Example

```ts
const firstDomain: SnsDomain | undefined = domains[0];
```

## Properties

### domain

> **domain**: `string`

Defined in: [utils/getSnsDomainsForOwner.ts:16](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsDomainsForOwner.ts#L16)

Fully qualified `.sns` domain name.

***

### key

> **key**: `PublicKey`

Defined in: [utils/getSnsDomainsForOwner.ts:19](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsDomainsForOwner.ts#L19)

Name-service account address for `domain`.
