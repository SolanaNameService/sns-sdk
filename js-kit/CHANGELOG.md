# JS Kit SDK v1.0.0

This is a breaking release of `@solana-name-service/sns-sdk-kit`.

Use this changelog as a migration guide from v0.10.0 to v1.0.0.

## Table of contents

1. [Domain suffix handling](#1-domain-suffix-handling)
2. [Renamed public APIs](#2-renamed-public-apis)
3. [Record reads and validation](#3-record-reads-and-validation)
4. [Instruction builders](#4-instruction-builders)

## 1. Domain suffix handling

v1 standardizes domain inputs across the SDK. High-level domain APIs require full suffixed names, while low-level address derivation and raw name-registry APIs continue to use TLD-trimmed or raw names.

### High-level read APIs

High-level read APIs now require a full domain name with a supported suffix.

Action required: update any bare domain strings passed to high-level read APIs to include `.sns` or `.sol`.

Use:

```ts
"mydomain.sns";
"sub.mydomain.sns";
"mydomain.sol";
"sub.mydomain.sol";
```

Bare names now throw an unsupported TLD error.

This applies to:

- `resolve`
- `getDomainOwner`
- `getDomainRecord`
- `getDomainRecords`
- `getSubdomains`

Example:

```ts
await resolve({ rpc, domain: "mydomain.sns" });
await resolve({ rpc, domain: "mydomain.sol" });

await getDomainOwner({ rpc, domain: "mydomain.sns" });
await getSubdomains({ rpc, domain: "mydomain.sns" });
```

Before finalized slot `452825395`, high-level `.sol` reads use the legacy SNS-backed compatibility path. At or after that slot, `.sol` reads throw `UnsupportedTldError`.

Native SRS-backed `.sol` resolution is not enabled in this release.

### Address derivation APIs

Low-level address derivation APIs continue to require TLD-trimmed names. They derive account addresses and do not perform RPC-based TLD support or cutoff checks.

This applies to:

- `getSnsDomainAddress`
- `getRecordV1Address`
- `getRecordV2Address`
- `getSrsDomainAddress`

Example:

```ts
await getSnsDomainAddress({ domain: "mydomain" });
await getSnsDomainAddress({ domain: "sub.mydomain" });

await getRecordV1Address({
  domain: "mydomain",
  record: Record.SOL,
});

await getRecordV2Address({
  domain: "sub.mydomain",
  record: Record.Url,
});

await getSrsDomainAddress({ domain: "mydomain" });
```

`getSnsDomainAddress`, `getRecordV1Address`, and `getRecordV2Address` derive accounts in the SNS account model. `getSrsDomainAddress` derives an SRS address only; it does not enable high-level SRS resolution.

### Write APIs

Write APIs support canonical lowercase `.sns` domains only.

Action required: update write API calls to pass lowercase `.sns` domains only.

Use:

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

This applies to write APIs such as `registerDomain`, `registerDomainWithNft`, `burnDomain`, `transferDomain`, `createSubdomain`, `transferSubdomain`, `createRecord`, `updateRecord`, `deleteRecord`, `setRecordStalenessVerifier`, `setRecordRoaVerifier`, `validateRecordRoa`, and `validateRecordRoaEthereum`.

Example:

```ts
await registerDomain({
  domain: "mydomain.sns",
  space,
  buyer,
  buyerTokenAccount,
});

await createRecord({
  domain: "sub.mydomain.sns",
  record: Record.Url,
  content: "https://example.com",
  owner,
  payer,
});
```

`registerDomain` no longer requires the rpc param.

Action required: remove `rpc` from `registerDomain` calls.

Before:

```ts
await registerDomain({
  rpc,
  domain: "mydomain.sns",
  space,
  buyer,
  buyerTokenAccount,
  referrer,
});
```

After:

```ts
await registerDomain({
  domain: "mydomain.sns",
  space,
  buyer,
  buyerTokenAccount,
  referrer,
});
```

### Raw name-registry APIs

Low-level raw name-registry APIs still use raw registry seed/name inputs, not full domain strings.

Action required: do not add `.sns` or `.sol` suffixes to raw name-registry inputs.

These APIs expect the raw name used for account derivation: `createNameRegistry`, `updateNameRegistry`, `deleteNameRegistry`, and `createReverse`.

For example, use `"mydomain"` rather than `"mydomain.sns"` when directly creating or updating a raw name-registry account.

## 2. Renamed public APIs

Several public APIs were renamed to keep method names consistent across the JS Kit SDK and the JS SDK.

Action required: update both imports and call sites. This applies to root-package imports and subpath imports.

| v0.10.0                | v1.0.0                      |
| ---------------------- | --------------------------- |
| `resolveDomain`        | `resolve`                   |
| `getAllDomains`        | `getAllSnsDomains`          |
| `getDomainsForAddress` | `getSnsDomainsForAddress`   |
| `getNftsForAddress`    | `getSnsNftsForAddress`      |
| `getNftMint`           | `getSnsNftMint`             |
| `getNftOwner`          | `getSnsNftOwner`            |
| `registerWithNft`      | `registerDomainWithNft`     |
| `validateRoa`          | `validateRecordRoa`         |
| `validateRoaEthereum`  | `validateRecordRoaEthereum` |
| `writeRoa`             | `setRecordRoaVerifier`      |

Before:

```ts
import {
  getDomainsForAddress,
  registerWithNft,
  resolveDomain,
} from "@solana-name-service/sns-sdk-kit";
```

After:

```ts
import {
  getSnsDomainsForAddress,
  registerDomainWithNft,
  resolve,
} from "@solana-name-service/sns-sdk-kit";
```

## 3. Record reads and validation

Record read results already included verification data in v0.10.0. In v1.0.0, the RoA verification field is aligned with the renamed RoA APIs:

Action required: replace reads of `verified.rightOfAssociation` with `verified.roa`.

```ts
// v0.10.0
result.verified.rightOfAssociation;

// v1.0.0
result.verified.roa;
```

The record verification bindings are now split by what they do:

- `setRecordRoaVerifier` stores the expected Right of Association verifier for a record. Use this when writing the verifier metadata that future reads or validations should compare against.
- `setRecordStalenessVerifier` is new in v1.0.0. It writes or refreshes the staleness verifier metadata for a record. Use this after record ownership or validation metadata needs to be refreshed.
- `validateRecordRoa` creates the Solana-signature validation instruction for a record Right of Association.
- `validateRecordRoaEthereum` creates the Ethereum-signature validation instruction for a record Right of Association.

This replaces the older, less explicit split where `writeRoa` wrote verifier metadata and `validateRoa` / `validateRoaEthereum` performed validation. The new names make the difference between storing verifier metadata and validating a record association explicit.

## 4. Instruction builders

Instruction builder classes now use PascalCase class names. This only affects consumers who import low-level instruction builders directly.

Action required: if you import low-level instruction classes directly, update lower-camel-case class names to PascalCase.

```ts
// v0.10.0
new burnDomainInstruction();

// v1.0.0
new BurnDomainInstruction();
```

The renamed instruction builders are:

- `RegisterFavoriteInstruction` -> `RegisterPrimaryInstruction`
- `WriteRoaInstruction` -> `SetRecordRoaVerifierInstruction`
- `ValidateRoaInstruction` -> `ValidateSolanaSignatureInstruction`
- `ValidateRoaEthereumInstruction` -> `ValidateEthereumSignatureInstruction`

The unused create instruction variants were removed:

- `createInstructionV3`
- `createV2Instruction`

For new code, prefer the binding helpers such as `registerDomain`, `transferDomain`, `createSubdomain`, `createRecord`, `updateRecord`, and `deleteRecord` unless you need to compose instructions manually.
