# JS SDK v4.0.0

This is a breaking release of `@bonfida/spl-name-service`.

Use this changelog as a migration guide from v3 to v4.

## Table of contents

1. [Domain suffix handling](#1-domain-suffix-handling)
2. [Renamed public APIs](#2-renamed-public-apis)
3. [Registration migration](#3-registration-migration)
4. [Transfer migration](#4-transfer-migration)
5. [Record migration](#5-record-migration)
6. [Removed APIs and modules](#6-removed-apis-and-modules)
7. [Package entrypoints and subpaths](#7-package-entrypoints-and-subpaths)

## 1. Domain suffix handling

v4 separates high-level domain APIs from low-level synchronous derivation APIs.

### High-level domain APIs

High-level domain APIs require a full domain name with a supported suffix.

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

Bare names passed to high-level APIs throw an unsupported TLD error.

This applies to APIs such as:

- `resolve`
- `getRecord`
- `getMultipleRecords`
- `verifyStaleness`
- `verifyRightOfAssociation`

Example:

```ts
await resolve(connection, "mydomain.sns");
await resolve(connection, "mydomain.sol");
```

Before slot `452825395` (`SOL_TLD_CUTOFF_SLOT`), high-level `.sol` reads and resolution use the existing SNS compatibility path. At or after that slot, high-level APIs including domain resolution will no longer support `.sol` domains and throw `UnsupportedTldError`.

`.sns` behavior is unaffected. SRS-based `.sol` resolution is expected to be restored in a separate future SDK update.

### Synchronous derivation APIs

Low-level synchronous derivation helpers take domain names with the TLD suffix already trimmed:

```ts
getSnsDomainKeySync("mydomain");
getSnsDomainKeySync("sub.mydomain");

getRecordV1Key("mydomain", Record.SOL);
getRecordV2Key("sub.mydomain", Record.Url);

getReverseKeySync("mydomain");
getReverseKeySync("sub.mydomain", true);

getCustomBgKeys("mydomain", CustomBg.DegenPoet1);
```

These helpers derive keys for the SPL Name Service-based registrar and account model. They are not applicable to `.sol` domains issued through SRS.

Do not pass `"mydomain.sns"` or `"mydomain.sol"` directly to these helpers. They derive account keys only and do not check current network support for a TLD.

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
- `setBackground`

Example:

```ts
await registerDomain("mydomain.sns", space, buyer, buyerTokenAccount);

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

| v3                           | v4                          |
| ---------------------------- | --------------------------- |
| `createRecordInstruction`    | `createRecord`              |
| `createRecordV2Instruction`  | `createRecord`              |
| `updateRecordInstruction`    | `updateRecord`              |
| `updateRecordV2Instruction`  | `updateRecord`              |
| `deleteRecordV2`             | `deleteRecord`              |
| `validateRecordV2Content`    | `validateRecordRoa`         |
| `ethValidateRecordV2Content` | `validateRecordRoaEthereum` |
| `writRoaRecordV2`            | `setRecordRoaVerifier`      |
| `registerDomainNameV2`       | `registerDomain`            |
| `registerWithNft`            | `registerDomainWithNft`     |
| `registerFavorite`           | `setPrimaryDomain`          |
| `transferNameOwnership`      | `transferDomain`            |
| `updateNameRegistryData`     | `updateNameRegistry`        |
| `createReverseName`          | `createReverse`             |
| `getAllRegisteredDomains`    | `getAllSnsDomains`          |
| `getAllDomains`              | `getSnsDomainKeysForOwner`  |
| `getDomainKeysWithReverses`  | `getSnsDomainsForOwner`     |
| `getTokenizedDomains`        | `getSnsNftsForOwner`        |
| `getDomainKeySync`           | `getSnsDomainKeySync`       |
| `FavouriteDomain`            | `PrimaryDomain`             |
| `getFavoriteDomain`          | `getPrimaryDomain`          |
| `getMultipleFavoriteDomains` | `getMultiplePrimaryDomains` |
| `ROOT_DOMAIN_ACCOUNT`        | `SNS_ROOT_DOMAIN_ACCOUNT`   |
| `HASH_PREFIX`                | `SNS_HASH_PREFIX`           |

### Domain queries by owner

Owner domain queries are separated by the information they return.

Use `getSnsDomainKeysForOwner` when only directly registry-owned top-level
domain account keys are required:

```ts
const keys = await getSnsDomainKeysForOwner(connection, owner);
// PublicKey[]
```

Use `getSnsDomainsForOwner` when domain names are also required:

```ts
const domains = await getSnsDomainsForOwner(connection, owner);
// Array<{
//   domain: string;
//   key: PublicKey;
// }>
```

`getSnsDomainsForOwner` replaces `getDomainKeysWithReverses`. Domains without
a valid reverse lookup record are omitted.

Tokenized domains are retrieved separately with `getSnsNftsForOwner`:

```ts
const nfts = await getSnsNftsForOwner(connection, owner);
// Array<{
//   domain: string;
//   key: PublicKey;
//   mint: PublicKey;
// }>
```

The `getSnsNftsForOwner` result property previously named `reverse` is now
named `domain`. Returned domain names do not include the `.sns` suffix.

The `SnsDomain` and `SnsNft` result interfaces are exported by the package.

## 3. Registration migration

### `registerDomainNameV2` -> `registerDomain`

`registerDomain` replaces `registerDomainNameV2`.

```ts
await registerDomain("mydomain.sns", space, buyer, buyerTokenAccount);
```

Important changes:

- pass `"mydomain.sns"` instead of `"mydomain"`
- subdomains such as `"sub.mydomain.sns"` are rejected
- `.sol` domains are rejected
- `registerDomain` no longer takes a `Connection` parameter

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
- `.sns` domains are accepted for reads
- `.sol` domains are accepted only before finalized slot `452825395`; at or after the cutoff they throw `UnsupportedTldError`

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

### Deriving record keys

`getRecordV1Key` and `getRecordV2Key` are synchronous derivation helpers. Trim the TLD suffix before calling them:

```ts
getRecordV1Key("mydomain", Record.SOL);
getRecordV2Key("sub.mydomain", Record.Url);
```

These helpers do not check current network support for `.sol`.

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

| v3                           | v4                                   |
| ---------------------------- | ------------------------------------ |
| `getRecords`                 | `getMultipleRecords`                 |
| `getRecordV2`                | `getRecord`                          |
| `getMultipleRecordsV2`       | `getMultipleRecords`                 |
| `serializeRecord`            | `serializeRecordContent`             |
| `deserializeRecord`          | `deserializeRecordContent`           |
| `serializeRecordV2Content`   | `serializeRecordContent`             |
| `deserializeRecordV2Content` | `deserializeRecordContent`           |
| `getRecordKeySync`           | `getRecordV1Key` or `getRecordV2Key` |

For new code, prefer the high-level record APIs: `getRecord`, `getMultipleRecords`, `createRecord`, `updateRecord`, `deleteRecord`, `serializeRecordContent`, and `deserializeRecordContent`.

## 6. Removed APIs and modules

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

## 7. Package entrypoints and subpaths

The root entry point remains fully supported, but V4 introduces curated category subpaths. You can now use subpath imports to target specific modules:

```ts
import { getPrimaryDomain } from "@bonfida/spl-name-service/address";
import { resolve } from "@bonfida/spl-name-service/domain";
import { getRecord, Record } from "@bonfida/spl-name-service/record";
```

The available subpath entrypoints are:
`address`, `bindings`, `constants`, `domain`, `errors`, `instructions`, `nft`, `record`, `states`, `twitter`, `types`, and `utils`.
