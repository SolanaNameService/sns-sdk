# JS SDK v4.0.0

This is a breaking release of `@bonfida/spl-name-service`.

Use this changelog as a migration guide from v3 to v4. The main migration work is:

- pass explicit TLD suffixes to domain APIs
- use `.sns` domains for write APIs
- update renamed bindings, utilities, and constants
- migrate records to the v4 record API

## 1. Domain suffix handling

v4 standardizes domain inputs across the SDK. APIs that work with domains no longer accept ambiguous bare names like `mydomain` unless they are low-level raw name-account APIs.

### Read APIs

Read and key-derivation APIs now require a full domain name with a supported suffix.

Use:

```ts
"mydomain.sns";
"sub.mydomain.sns";
"mydomain.sol";
"sub.mydomain.sol";
```

Do not use:

```ts
"mydomain";
"sub.mydomain";
```

Bare names now throw an unsupported TLD error.

Read APIs accept both `.sns` and `.sol`. In v4, `.sol` is an alias for the `.sns` derivation and resolution path for compatibility. There is no separate `.sol` implementation in this release.

This applies to read and key-derivation APIs such as:

- `resolve`
- `getDomainKeySync`
- `getRecord`
- `getMultipleRecords`
- `getRecordV1Key`
- `getRecordV2Key`

Example:

```ts
await resolve(connection, "mydomain.sns");
await resolve(connection, "mydomain.sol");

getDomainKeySync("sub.mydomain.sns");
getDomainKeySync("sub.mydomain.sol");
```

### Write APIs

Write APIs support `.sns` domains only.

Use canonical lowercase `.sns` names:

```ts
"mydomain.sns";
"sub.mydomain.sns";
```

Do not pass:

```ts
"mydomain";
"mydomain.sol";
"MyDomain.sns";
" mydomain.sns ";
```

This applies to write APIs such as:

- `registerDomain`
- `registerDomainWithNft`
- `burnDomain`
- `transferDomain`
- `createSubdomain`
- `transferSubdomain`
- `createRecord`
- `updateRecord`
- `deleteRecord`
- `setRecordStalenessVerifier`
- `setRecordRoaVerifier`
- `validateRecordRoa`
- `validateRecordRoaEthereum`

Example:

```ts
await registerDomain(connection, "mydomain.sns", space, buyer, buyerTokenAccount);

createRecord(
  "sub.mydomain.sns",
  Record.Url,
  "https://example.com",
  owner,
  payer,
);
```

### Raw name-account APIs

Low-level name-account APIs still use raw name account inputs, not full domain strings.

These APIs expect the raw name used for account derivation:

- `createNameRegistry`
- `updateNameRegistry`
- `deleteNameRegistry`
- `createReverse`

For example, use `"mydomain"` rather than `"mydomain.sns"` when directly creating or updating a raw name account.

## 2. Renamed public APIs

Update imports and function calls using this map.

| v3 | v4 |
| --- | --- |
| `createRecordInstruction` | `createRecord` |
| `createRecordV2Instruction` | `createRecord` |
| `updateRecordInstruction` | `updateRecord` |
| `updateRecordV2Instruction` | `updateRecord` |
| `deleteRecordV2` | `deleteRecord` |
| `validateRecordV2Content` | `validateRecordRoa` |
| `ethValidateRecordV2Content` | `validateRecordRoaEthereum` |
| `writRoaRecordV2` | `setRecordRoaVerifier` |
| `registerDomainNameV2` | `registerDomain` |
| `registerWithNft` | `registerDomainWithNft` |
| `registerFavorite` | `setPrimaryDomain` |
| `transferNameOwnership` | `transferDomain` |
| `updateNameRegistryData` | `updateNameRegistry` |
| `createReverseName` | `createReverse` |
| `getAllRegisteredDomains` | `getAllSnsDomains` |
| `getAllDomains` | `getSnsDomainsForOwner` |
| `getTokenizedDomains` | `getSnsNftsForOwner` |
| `FavouriteDomain` | `PrimaryDomain` |
| `getFavoriteDomain` | `getPrimaryDomain` |
| `getMultipleFavoriteDomains` | `getMultiplePrimaryDomains` |
| `ROOT_DOMAIN_ACCOUNT` | `SNS_ROOT_DOMAIN_ACCOUNT` |

## 3. Registration migration

### `registerDomainNameV2` -> `registerDomain`

`registerDomain` replaces `registerDomainNameV2`.

```ts
await registerDomain(
  connection,
  "mydomain.sns",
  space,
  buyer,
  buyerTokenAccount,
);
```

Important changes:

- pass `"mydomain.sns"` instead of `"mydomain"`
- subdomains such as `"sub.mydomain.sns"` are rejected
- `.sol` domains are rejected

### `registerWithNft` -> `registerDomainWithNft`

`registerDomainWithNft` replaces `registerWithNft`, and its arguments changed.

```ts
registerDomainWithNft(
  "mydomain.sns",
  space,
  nameAccount,
  reverseLookupAccount,
  buyer,
  nftSource,
  nftMint,
);
```

Important changes:

- pass `"mydomain.sns"` instead of `"mydomain"`
- do not pass `nftMetadata`
- do not pass `masterEdition`
- `nftMetadata` and `masterEdition` are now derived internally from `nftMint`
- subdomains such as `"sub.mydomain.sns"` are rejected
- `.sol` domains are rejected

## 4. Transfer migration

### `transferNameOwnership` -> `transferDomain`

`transferDomain` replaces `transferNameOwnership` for top-level `.sns` domains.

```ts
await transferDomain(connection, "mydomain.sns", newOwner);
```

Important changes:

- pass a full top-level `.sns` domain
- bare names are rejected
- `.sol` domains are rejected
- generic ownership parameters from `transferNameOwnership` are no longer part of this helper

For subdomains, use `transferSubdomain` with a full `.sns` subdomain:

```ts
await transferSubdomain(connection, "sub.mydomain.sns", newOwner);
```

## 5. Record migration

v4 standardizes public record APIs around SNS record V2.

### Reading one record

`getRecord` now takes an options object and returns a structured `RecordResult`.

```ts
const result = await getRecord(connection, "mydomain.sns", Record.Url, {
  deserialize: true,
});
```

Important changes:

- use `{ deserialize: true }` instead of `true`
- the return value is no longer a raw `NameRegistryState`
- the return value is no longer a plain string when deserializing
- `.sns` and `.sol` domains are accepted for reads

Use these fields on the returned object:

- `result.record`
- `result.retrievedRecord`
- `result.verified.staleness`
- `result.verified.roa`
- `result.deserializedContent`

### Reading multiple records

Use `getMultipleRecords` for batch reads.

```ts
const results = await getMultipleRecords(
  connection,
  "mydomain.sns",
  [Record.Url, Record.Discord],
  { deserialize: true },
);
```

Each returned item is either a `RecordResult` or `undefined` if that record does not exist.

### Writing records

Record write and validation APIs are `.sns` only.

```ts
createRecord("mydomain.sns", Record.Url, "https://example.com", owner, payer);
updateRecord("mydomain.sns", Record.Url, "https://example.com", owner, payer);
deleteRecord("mydomain.sns", Record.Url, owner, payer);
```

For subdomains:

```ts
createRecord(
  "sub.mydomain.sns",
  Record.Url,
  "https://example.com",
  owner,
  payer,
);
```

Do not pass `.sol` domains to record write or validation APIs.

### Record helper rename map

| v3 | v4 |
| --- | --- |
| `getRecords` | `getMultipleRecords` |
| `getRecordV2` | `getRecord` |
| `getMultipleRecordsV2` | `getMultipleRecords` |
| `serializeRecord` | `serializeRecordContent` |
| `deserializeRecord` | `deserializeRecordContent` |
| `serializeRecordV2Content` | `serializeRecordContent` |
| `deserializeRecordV2Content` | `deserializeRecordContent` |
| `getRecordKeySync` | `getRecordV1Key` or `getRecordV2Key` |

For new code, prefer the high-level record APIs: `getRecord`, `getMultipleRecords`, `createRecord`, `updateRecord`, `deleteRecord`, `serializeRecordContent`, and `deserializeRecordContent`.

## 6. Removed deprecated APIs and modules

The deprecated JS modules under `src/deprecated/*` were removed.

The following legacy exports were also removed or replaced:

- `registerDomainName`
- `createInstructionV3`
- `createV2Instruction`
- `createSolRecordInstruction`
- `updateSolRecordInstruction`
- `resolveSolRecordV1`
- `resolveSolRecordV2`
- legacy per-record helper exports such as `getUrlRecord`, `getDiscordRecord`, `getGithubRecord`, and similar helpers

Use the replacement APIs listed above for v4 migrations.
