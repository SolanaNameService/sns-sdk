---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useProfilePic](../index.md) / useProfilePic

# Function: useProfilePic()

> **useProfilePic**\<`TData`\>(`connection`, `domain`, `options?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/useProfilePic/index.ts:34](https://github.com/SolanaNameService/sns-sdk/blob/3e73244d2a3db5b2505a14c08e8f2bb03d4da18e/react/src/hooks/useProfilePic/index.ts#L34)

Retrieves verified, deserialized profile-picture content through React Query.

Stale records and records that fail an applicable right-of-association check
are rejected.

## Type Parameters

### TData

`TData` = `string` \| `null`

## Parameters

### connection

`Connection`

Solana RPC connection

### domain

`string`

Canonical lowercase `.sns` domain name, including a top-level
domain or one-level subdomain

### options?

[`Options`](../../Types/type-aliases/Options.md)\<`string` \| `null`, `TData`\> = `{}`

Optional React Query settings

## Returns

`UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

React Query result where `data` is profile-picture content or `null`
when no safe value exists; `isPending` tracks the initial request, while
failures populate `error` and set `isError` without throwing during render.

Query failures are exposed through the result's `error` and `isError` fields.
`.sol` and malformed names surface the JavaScript SDK's validation errors.

## Example

```tsx
const { data: profilePicture } = useProfilePic(connection, "example.sns");
```
