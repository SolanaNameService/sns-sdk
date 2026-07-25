<p align="center">
  <img width="200" src="https://www.sns.id/assets/logo/brand.svg" alt="SNS logo" />
</p>

# SNS JS Kit SDK

[![npm](https://img.shields.io/npm/v/@solana-name-service/sns-sdk-kit)](https://www.npmjs.com/package/@solana-name-service/sns-sdk-kit)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../LICENSE)

TypeScript SDK for resolving Solana Name Service (SNS) domains, reading records and ownership, and constructing SNS instructions with [`@solana/kit`](https://www.npmjs.com/package/@solana/kit). It is the SDK for `@solana/kit`, not the `@solana/web3.js` 1.x SDK. It provides no React provider, wallet adapter, or global SDK client: pass your typed RPC client and compose transactions with your wallet or signer.

> **Migrating from v0?** This release is not fully backward compatible. Review the [changelog](./CHANGELOG.md) for breaking changes and migration notes.

## Installation

```bash
npm install @solana-name-service/sns-sdk-kit @solana/kit
```

Requirements:

- Node.js `>=24.0.0`.
- `@solana/kit ^6.9.0` as a peer dependency.
- An RPC client with the APIs required by the operation.

Read APIs fetch and decode account data. Write builders return `Instruction`, `Promise<Instruction>`, or `Promise<Instruction[]>`. Build a transaction around the returned instruction(s), set its fee payer and recent blockhash, collect the signatures required by its account metas, and submit that transaction through your RPC client.

## Quick Start

Create a typed `@solana/kit` RPC client and pass it explicitly to each operation:

```typescript
import {
  createDefaultRpcTransport,
  createSolanaRpcFromTransport,
} from "@solana/kit";

const rpcUrl = process.env.RPC_URL;
if (!rpcUrl) throw new Error("RPC_URL is required");

const transport = createDefaultRpcTransport({
  url: rpcUrl,
});
const rpc = createSolanaRpcFromTransport(transport);
```

### Resolve A Domain

```typescript
import { resolve } from "@solana-name-service/sns-sdk-kit";

const owner = await resolve({
  rpc,
  domain: "wallet-guide-9.sns",
  options: { allowPda: false },
});

console.log(owner);
```

### Get A Primary Domain

```typescript
import { getPrimaryDomain } from "@solana-name-service/sns-sdk-kit";
import type { Address } from "@solana/kit";

const walletAddress = "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4" as Address;
const primaryDomain = await getPrimaryDomain({ rpc, walletAddress });

console.log(primaryDomain.domainName, primaryDomain.stale);
```

### List Domains For An Address

```typescript
import { getSnsDomainsForAddress } from "@solana-name-service/sns-sdk-kit";
import type { Address } from "@solana/kit";

const address = "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4" as Address;
const domains = await getSnsDomainsForAddress({ rpc, address });

console.log(domains);
```

## Domain Inputs And Resolution

Use the form required by each API rather than normalizing names yourself:

| API family                                                                                      | Required input                                             | Scope                                                                                        |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| High-level reads such as `resolve`, `getDomainOwner`, `getDomainRecord`, and `getDomainRecords` | Full suffixed name, for example `mydomain.sns`             | `.sns`; legacy `.sol` reads have the transition rule below                                   |
| Subdomain reads such as `getSubdomains`                                                         | Full suffixed top-level name, for example `mydomain.sns`   | `.sns`                                                                                       |
| Top-level writes such as registration, transfer, and burn                                       | Canonical lowercase `mydomain.sns`                         | Exactly one label before `.sns`                                                              |
| Record writes                                                                                   | Canonical lowercase `mydomain.sns` or `sub.mydomain.sns`   | Top-level domain or one-level subdomain                                                      |
| Subdomain creation and transfer                                                                 | Canonical lowercase `sub.mydomain.sns`                     | Exactly one subdomain level                                                                  |
| SNS derivation and record-address helpers                                                       | TLD-trimmed name, for example `mydomain` or `sub.mydomain` | Pass to `getSnsDomainAddress`; it derives domain, subdomain, and record addresses            |
| SRS derivation                                                                                  | TLD-trimmed `.sol` label, for example `mydomain`           | Pass to `getSrsDomainAddress` only when an SRS address is specifically needed                |
| Raw registry helpers                                                                            | Raw labels and explicit parent/class addresses             | Use the advanced name-registry helpers when the higher-level `.sns` conventions do not apply |

High-level `.sol` reads use the legacy SNS-backed path only before finalized slot `452,825,395`. At and after that slot, `.sol` is rejected. `.sol` writes are not supported.

## API Reference

### Resolution

- **`resolve`** — resolves a full `.sns` domain, or a legacy `.sol` domain while the transition path remains available, to its effective owner.

  ```ts
  resolve({ rpc, domain, options? }): Promise<Address>
  ```

### Record Reads And Validation

- **`getDomainRecord`** — retrieves and verifies one V2 record.

  ```ts
  getDomainRecord({ rpc, domain, record, options? }): Promise<RecordResult>
  ```

- **`getDomainRecords`** — returns one entry per requested record; a missing account is `undefined` at its corresponding index.

  ```ts
  getDomainRecords({ rpc, domain, records, options? }): Promise<(RecordResult | undefined)[]>
  ```

The following standalone helpers do not come from `RecordResult`:

- **`getRecordV1Address`** / **`getRecordV2Address`** — derive account addresses from a TLD-trimmed domain without fetching them.

  ```ts
  getRecordV1Address({ domain, record }): Promise<Address>
  getRecordV2Address({ domain, record }): Promise<Address>
  ```

- **`serializeRecordContent`** / **`deserializeRecordContent`** — encode content for storage, or decode stored content.

  ```ts
  serializeRecordContent({ content, record }): ReadonlyUint8Array
  deserializeRecordContent({ content, record }): string
  ```

- **`verifyRecordStaleness`** — independently fetches and checks a V2 record's staleness validation.

  ```ts
  verifyRecordStaleness({ rpc, domain, record }): Promise<boolean>
  ```

- **`verifyRecordRightOfAssociation`** — independently fetches and checks a V2 record's right-of-association validation.

  ```ts
  verifyRecordRightOfAssociation(rpc, domain: string, record: Record, verifier?: ReadonlyUint8Array): Promise<boolean>
  ```

### Record Writes

Each function below returns one `Instruction`:

- **`createRecord`**

  ```ts
  createRecord({ domain, record, content, owner, payer }): Promise<Instruction>
  ```

- **`updateRecord`**

  ```ts
  updateRecord({ domain, record, content, owner, payer }): Promise<Instruction>
  ```

- **`deleteRecord`**

  ```ts
  deleteRecord({ domain, record, owner, payer }): Promise<Instruction>
  ```

- **`setRecordStalenessVerifier`**

  ```ts
  setRecordStalenessVerifier({ domain, record, owner, payer, verifier }): Promise<Instruction>
  ```

- **`setRecordRoaVerifier`**

  ```ts
  setRecordRoaVerifier({ domain, record, owner, payer, verifier }): Promise<Instruction>
  ```

- **`validateRecordRoa`**

  ```ts
  validateRecordRoa({ domain, record, owner, payer, verifier }): Promise<Instruction>
  ```

- **`validateRecordRoaEthereum`**

  ```ts
  validateRecordRoaEthereum({ domain, record, owner, payer, signature, expectedPubkey }): Promise<Instruction>
  ```

### Registration And Lifecycle

Registration is limited to a lowercase top-level `.sns` name. Return shapes differ by operation:

- **`registerDomain`** — returns the registration instructions. It uses a supported payment mint/feed and only incorporates a referrer when it is supported by the SDK.

  ```ts
  registerDomain({ domain, space, buyer, buyerTokenAccount, mint?, referrer? }): Promise<Instruction[]>
  ```

- **`registerDomainWithNft`** — returns one NFT-based registration instruction.

  ```ts
  registerDomainWithNft({ domain, space, buyer, nftSource, nftMint }): Promise<Instruction>
  ```

- **`transferDomain`** — retrieves the current owner and returns one transfer instruction.

  ```ts
  transferDomain({ rpc, domain, newOwner }): Promise<Instruction>
  ```

- **`burnDomain`** — returns one burn instruction; `refundAddress` receives reclaimed lamports.

  ```ts
  burnDomain({ domain, owner, refundAddress }): Promise<Instruction>
  ```

- **`setPrimaryDomain`** — returns one instruction for an already derived domain account. `domainAddress` is an already derived domain account, not a domain string.

  ```ts
  setPrimaryDomain({ rpc, domainAddress, owner }): Promise<Instruction>
  ```

### Subdomains

- **`getSubdomains`** — lists subdomains and owners under a top-level parent. Entries without reverse data are omitted.

  ```ts
  getSubdomains({ rpc, domain }): Promise<{ subdomain: string; owner: Address }[]>
  ```

- **`createSubdomain`** — returns the name-account creation instruction(s). `subdomain` must be a lowercase one-level `.sns` subdomain.

  ```ts
  createSubdomain({ rpc, subdomain, owner, space?, feePayer? }): Promise<Instruction[]>
  ```

- **`transferSubdomain`** — returns one transfer instruction. When `currentOwner` is omitted, the function retrieves the current owner; set `isParentOwnerSigner` when the parent owner authorizes the transfer.

  ```ts
  transferSubdomain({ rpc, subdomain, newOwner, isParentOwnerSigner?, currentOwner? }): Promise<Instruction>
  ```

### Ownership And Reverse Lookup

- **`getDomainOwner`** — returns the domain's owner: the tokenized-domain NFT owner when present, otherwise the registry owner. It does not apply `SOL`-record precedence or PDA policy, so the result is not necessarily the domain's SNS-IP-5 resolution target; use `resolve` when that target is required.

  ```ts
  getDomainOwner({ rpc, domain }): Promise<Address>
  ```

- **`getAllSnsDomains`** — lists top-level SNS registry accounts and their registry owners.

  ```ts
  getAllSnsDomains({ rpc }): Promise<{ domainAddress: Address; owner: Address }[]>
  ```

- **`getPrimaryDomain`** — returns a primary-domain account, its TLD-less name, and whether the wallet is no longer its effective owner.

  ```ts
  getPrimaryDomain({ rpc, walletAddress }): Promise<{ domainAddress: Address; domainName: string; stale: boolean }>
  ```

- **`getPrimaryDomainsBatch`** — returns valid, non-stale, TLD-less primary names positionally aligned with `walletAddresses`.

  ```ts
  getPrimaryDomainsBatch({ rpc, walletAddresses }): Promise<(string | undefined)[]>
  ```

- **`getSnsDomainsForAddress`** — returns directly registry-owned top-level domains only. Tokenized domains and subdomains are excluded, and entries without reverse records are omitted.

  ```ts
  getSnsDomainsForAddress({ rpc, address }): Promise<{ domain: string; domainAddress: Address }[]>
  ```

- **`getSnsNftsForAddress`** — returns tokenized SNS domains with reverse data.

  ```ts
  getSnsNftsForAddress({ rpc, address }): Promise<{ domain: string; domainAddress: Address; mint: Address }[]>
  ```

- **`reverseLookup`** — returns one TLD-less reverse name for a domain address.

  ```ts
  reverseLookup({ rpc, domainAddress, parentAddress? }): Promise<string>
  ```

- **`reverseLookupBatch`** — returns TLD-less names in input order; missing reverse records are `undefined`.

  ```ts
  reverseLookupBatch({ rpc, domainAddresses }): Promise<(string | undefined)[]>
  ```

### Advanced APIs

For account-level integrations, the root export also includes derivation and raw name-registry helpers such as `getSnsDomainAddress`, `getSrsDomainAddress`, `getReverseAddress`, `getReverseAddressFromDomainAddress`, `checkAddressOnCurve`, `deserializeReverse`, `getPythFeedAddress`, `getTld`, `createNameRegistry`, `updateNameRegistry`, `deleteNameRegistry`, and `createReverse`.

NFT helpers and state classes include `getSnsNftMint`, `getSnsNftOwner`, `RegistryState`, `RecordState`, `NftState`, and `PrimaryDomainState`. Low-level instruction classes are also exported; use the `@solana-name-service/sns-sdk-kit/instructions` export for custom transaction composition rather than treating those constructors as an onboarding API.

## Documentation And Migration

- [Developer documentation](https://dev.sns.id/)
- [Migration notes and changelog](./CHANGELOG.md)
- [SDK monorepo overview](../README.md)
- [SNS guide](https://guide.sns.id/)

## License

Released under the [MIT License](../LICENSE).
