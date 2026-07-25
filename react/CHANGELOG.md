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
