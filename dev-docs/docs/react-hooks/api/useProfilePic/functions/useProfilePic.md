---
displayed_sidebar: docsSidebar
---

[React Hooks API Reference](../../index.md) / [useProfilePic](../index.md) / useProfilePic

# Function: useProfilePic()

> **useProfilePic**\<`TData`\>(`connection`, `domain`, `options?`): `UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

Defined in: [react/src/hooks/useProfilePic/index.ts:32](https://github.com/Bonfida/sns-sdk-beta/blob/2ee005dffe8ba20dd8d38eda54d669d0225b4b26/react/src/hooks/useProfilePic/index.ts#L32)

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

Full `.sns` or `.sol` domain name

### options?

[`Options`](../../Types/type-aliases/Options.md)\<`string` \| `null`, `TData`\> = `{}`

Optional React Query settings

## Returns

`UseQueryResult`\<`NoInfer`\<`TData`\>, `Error`\>

React Query result where `data` is profile-picture content or `null`
when no safe value exists; `isPending` tracks the initial request, while
failures populate `error` and set `isError` without throwing during render.

Query failures are exposed through the result's `error` and `isError` fields.

## Example

```tsx
const { data: profilePicture } = useProfilePic(connection, "example.sns");
```
