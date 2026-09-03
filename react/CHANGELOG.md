# SNS React v4.1.0

SNS React now targets JavaScript SDK 4.1.0.

## Dependencies

Update the JavaScript SDK peer dependency when upgrading:

```bash
npm install @bonfida/sns-react @bonfida/spl-name-service@^4.1.0 @solana/web3.js@^1.98.2 @tanstack/react-query@^5.0.0 react
```

## Changed

### `.sol` resolution

`useResolve` and `useSafeResolve` now use the JavaScript SDK's SRS-backed `.sol`
resolution. The previous slot-based compatibility routing is no longer used.
SRS errors such as expired or malformed domains are exposed through the query
result's `error` field.

For `.sol` domains, `useSafeResolve` requires the SRS target and corresponding
`.sns` target to match. A mismatch is surfaced as
`SnsSolResolutionMismatchError`.

### Record hooks

`useRecords` and `useProfilePic` now follow the JavaScript SDK 4.1.0 record
input rules. They accept canonical lowercase `.sns` top-level domains and
one-level subdomains only.

Applications using these hooks for `.sol` records must switch to an appropriate
`.sns` name or use `useResolve`/`useSafeResolve` for domain resolution.

## New hooks

- `useSnsNftsForOwner` returns tokenized `.sns` domains with their
  name-service account and NFT mint public keys.
- `useSolDomainsForOwner` returns non-expired, directly wallet-owned
  top-level `.sol` domains. Tokenized domains and subdomains are excluded.
- `useSolNftsForOwner` returns non-expired, tokenized `.sol` domains with
  their SRS record and NFT mint public keys.

---

# SNS React v4.0.0

This is a breaking release of `@bonfida/sns-react` for JavaScript SDK v4. There is no SNS React v3 compatibility layer.

## Dependencies

SNS React now uses the stable JavaScript SDK v4 package:

```bash
npm install @bonfida/sns-react @bonfida/spl-name-service@^4.0.0 @solana/web3.js@^1.98.2 @tanstack/react-query@^5.0.0 react
```

- React 18 and 19 are supported.
- The JavaScript SDK, web3.js, React Query, and React are peer dependencies.
- Repository development links the adjacent prerelease `js/` package source.

## Updated hooks

### `useSafeResolve`

`useSafeResolve` is new in v4. It follows `useResolve`, except that JS SDK `safeResolve` conditionally checks that SRS-backed `.sol` resolution and the corresponding `.sns` domain resolve to the same target. A mismatch appears as `SnsSolResolutionMismatchError` in the query result's `error` field.

The following v3 hooks have been renamed or replaced in v4:

| v3 hook                  | v4 equivalent                            |
| ------------------------ | ---------------------------------------- |
| `useDomainsForOwner`     | `useSnsDomainsForOwner`                  |
| `useFavoriteDomain`      | `usePrimaryDomain`                       |
| `useRecordsV2`           | `useRecords`                             |
| `useDeserializedRecords` | `useRecords(..., { deserialize: true })` |

The following hooks have been removed in v4 without direct replacements:

- `useDomainSize`
- `useSearch`
- `useDomainSuggestions`
- `useTopDomainsSales`

See the [README](./README.md) for current API behavior, domain rules, record verification, and package usage.
