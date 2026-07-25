---
displayed_sidebar: docsSidebar
---

[JavaScript SDK API Reference](../../index.md) / [Domain](../index.md) / SnsDomainKey

# Interface: SnsDomainKey

Defined in: [utils/getSnsDomainKeySync.ts:29](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsDomainKeySync.ts#L29)

A derived SNS domain account and its parent metadata.

## Example

```ts
const result: SnsDomainKey = getSnsDomainKeySync("example");
```

## Properties

### hashed

> **hashed**: `Buffer`

Defined in: [utils/getSnsDomainKeySync.ts:33](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsDomainKeySync.ts#L33)

Hash used to derive the account address.

***

### isSub

> **isSub**: `boolean`

Defined in: [utils/getSnsDomainKeySync.ts:35](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsDomainKeySync.ts#L35)

Whether the input is a subdomain or subdomain record.

***

### isSubRecord?

> `optional` **isSubRecord?**: `boolean`

Defined in: [utils/getSnsDomainKeySync.ts:39](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsDomainKeySync.ts#L39)

Whether the input is a subdomain record.

***

### parent?

> `optional` **parent?**: `PublicKey`

Defined in: [utils/getSnsDomainKeySync.ts:37](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsDomainKeySync.ts#L37)

Parent domain account address for subdomains.

***

### pubkey

> **pubkey**: `PublicKey`

Defined in: [utils/getSnsDomainKeySync.ts:31](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/js/src/utils/getSnsDomainKeySync.ts#L31)

Derived SNS account address.
