<p align="center">
  <img width="200" src="https://www.sns.id/assets/logo/brand.svg" alt="SNS logo" />
</p>

# SNS JavaScript SDK

[![npm](https://img.shields.io/npm/v/@bonfida%2Fspl-name-service)](https://www.npmjs.com/package/@bonfida/spl-name-service)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../LICENSE)

JavaScript SDK for resolving Solana Name Service (SNS) domains, reading records and ownership data, and constructing SNS transaction instructions with `@solana/web3.js` 1.x.

> **Migrating from v3?** This release is not fully backward compatible. Review the [changelog](./CHANGELOG.md) for breaking changes and migration notes.

## Installation

```bash
npm install @bonfida/spl-name-service @solana/web3.js
```

The SDK has a peer dependency on `@solana/web3.js` `^1.98.2`. Supply a web3.js Connection for RPC operations. While Node.js is the primary tested environment, browser applications are fully supported via compatible bundlers.

Read APIs fetch and decode account data. Mutation bindings return `TransactionInstruction`, `Promise<TransactionInstruction>`, or `Promise<TransactionInstruction[]>`. Add the returned instruction(s) to a transaction, set its fee payer and recent blockhash, collect the signatures required by its account metas, and submit that transaction through your application.

### Subpath Imports

While the root entry point remains available, applications can also use subpath imports:

```ts
import { getPrimaryDomain } from "@bonfida/spl-name-service/address";
import { resolve, safeResolve } from "@bonfida/spl-name-service/domain";
import { getMultipleRecords, Record } from "@bonfida/spl-name-service/record";
```

Supported subpaths are `address`, `bindings`, `constants`, `domain`, `errors`, `instructions`, `nft`, `record`, `states`, `twitter`, `types`, and `utils`.

## Quick Start

### Resolve A Domain

```ts
import { Connection } from "@solana/web3.js";
import { resolve } from "@bonfida/spl-name-service/domain";

const connection = new Connection("https://your-rpc-endpoint.example");
const owner = await resolve(connection, "mydomain.sns"); // Or use `safeResolve`.

console.log(owner.toBase58());
```

### Get A Primary Domain

```ts
import { Connection, PublicKey } from "@solana/web3.js";
import { getPrimaryDomain } from "@bonfida/spl-name-service/address";

const connection = new Connection("https://your-rpc-endpoint.example");
const wallet = new PublicKey("<WALLET_ADDRESS>");
const primaryDomain = await getPrimaryDomain(connection, wallet);

console.log(`${primaryDomain.reverse}.sns`, primaryDomain.stale);
```

### List Domains For An Owner

```ts
import { Connection, PublicKey } from "@solana/web3.js";
import { getSnsDomainsForOwner } from "@bonfida/spl-name-service/address";

const connection = new Connection("https://your-rpc-endpoint.example");
const wallet = new PublicKey("<WALLET_ADDRESS>");
const domains = await getSnsDomainsForOwner(connection, wallet);

console.log(domains.map(({ domain }) => `${domain}.sns`));
```

## Domain Inputs And Resolution

Use the form required by each API rather than normalizing names yourself:

| API family                                                                               | Required input                                                     | Scope                                                      |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| High-level reads such as `resolve`, `safeResolve`, `getRecord`, and `getMultipleRecords` | Full suffixed name, for example `mydomain.sns`                     | `.sns`; legacy `.sol` reads have the transition rule below |
| Top-level writes such as registration, transfer, burn, and background changes            | Canonical lowercase `mydomain.sns`                                 | Exactly one label before `.sns`                            |
| Record writes                                                                            | Canonical lowercase `mydomain.sns` or `sub.mydomain.sns`           | Top-level domain or one-level subdomain                    |
| Subdomain creation                                                                       | Canonical lowercase `sub.mydomain.sns`                             | Exactly one subdomain level                                |
| Derivation and raw name-account helpers                                                  | TLD-trimmed or raw input, for example `mydomain` or `sub.mydomain` | Follow each low-level helper's account-format contract     |

High-level `.sol` reads use the legacy SNS-backed path only before finalized slot `452,825,395`. At and after that slot, `.sol` is rejected. `.sol` writes are not supported.

## API Reference

### Resolution

- **`resolve`** — resolves a `.sns` domain, or a legacy `.sol` domain while the transition path remains available.

  ```ts
  resolve(connection: Connection, domain: string, config?: ResolveConfig): Promise<PublicKey>
  ```

- **`safeResolve`** — follows `resolve`, but when SRS-backed `.sol` resolution is enabled, it also checks the SNS-backed target and throws `SnsSolResolutionMismatchError` if the addresses differ.

  ```ts
  safeResolve(connection: Connection, domain: string, config?: ResolveConfig): Promise<PublicKey>
  ```

### Record Reads And Validation

- **`getRecord`** — fetches and verifies one V2 record.

  ```ts
  getRecord(connection: Connection, domain: string, record: Record, options?: { deserialize?: boolean }): Promise<RecordResult>
  ```

- **`getMultipleRecords`** — returns results in input order; a missing record account is `undefined` at its corresponding index.

  ```ts
  getMultipleRecords(connection: Connection, domain: string, records: Record[], options?: { deserialize?: boolean }): Promise<(RecordResult | undefined)[]>
  ```

The following standalone helpers do not come from `RecordResult`:

- **`getRecordV1Key`** / **`getRecordV2Key`** — derive record account keys from a TLD-trimmed domain such as `mydomain`.

  ```ts
  getRecordV1Key(domain: string, record: Record): PublicKey
  getRecordV2Key(domain: string, record: Record): PublicKey
  ```

- **`serializeRecordContent`** / **`deserializeRecordContent`** — encode content for storage, or decode stored content.

  ```ts
  serializeRecordContent(content: string, record: Record): Buffer
  deserializeRecordContent(content: Buffer, record: Record): string
  ```

- **`verifyStaleness`** — independently fetches and checks a V2 record's staleness validation.

  ```ts
  verifyStaleness(connection: Connection, record: Record, domain: string): Promise<boolean>
  ```

- **`verifyRightOfAssociation`** — independently fetches and checks a V2 record's right-of-association validation.

  ```ts
  verifyRightOfAssociation(connection: Connection, record: Record, domain: string, verifier?: Buffer): Promise<boolean>
  ```

### Record Writes

Each function below synchronously returns one `TransactionInstruction`:

- **`createRecord`**

  ```ts
  createRecord(domain: string, record: Record, content: string, owner: PublicKey, payer: PublicKey): TransactionInstruction
  ```

- **`updateRecord`**

  ```ts
  updateRecord(domain: string, record: Record, content: string, owner: PublicKey, payer: PublicKey): TransactionInstruction
  ```

- **`deleteRecord`**

  ```ts
  deleteRecord(domain: string, record: Record, owner: PublicKey, payer: PublicKey): TransactionInstruction
  ```

- **`setRecordStalenessVerifier`**

  ```ts
  setRecordStalenessVerifier(domain: string, record: Record, owner: PublicKey, payer: PublicKey, verifier: PublicKey): TransactionInstruction
  ```

- **`setRecordRoaVerifier`**

  ```ts
  setRecordRoaVerifier(domain: string, record: Record, owner: PublicKey, payer: PublicKey, verifier: PublicKey): TransactionInstruction
  ```

- **`validateRecordRoa`**

  ```ts
  validateRecordRoa(domain: string, record: Record, owner: PublicKey, payer: PublicKey, verifier: PublicKey): TransactionInstruction
  ```

- **`validateRecordRoaEthereum`** — `signature` is 64 bytes and `expectedPubkey` is a 20-byte Ethereum address.

  ```ts
  validateRecordRoaEthereum(domain: string, record: Record, owner: PublicKey, payer: PublicKey, signature: Buffer, expectedPubkey: Buffer): TransactionInstruction
  ```

### Registration And Lifecycle

Registration is limited to a lowercase top-level `.sns` name. Return shapes differ by operation:

- **`registerDomain`** — returns the registration instruction and may prepend an idempotent referrer associated-token-account instruction. The selected mint must have a configured Pyth price feed.

  ```ts
  registerDomain(domain: string, space: number, buyer: PublicKey, buyerTokenAccount: PublicKey, mint?: PublicKey, referrerKey?: PublicKey): Promise<TransactionInstruction[]>
  ```

- **`registerDomainWithNft`** — returns one Wolves-NFT registration instruction. Derive `nameAccount` and `reverseLookupAccount` before calling it.

  ```ts
  registerDomainWithNft(domain: string, space: number, nameAccount: PublicKey, reverseLookupAccount: PublicKey, buyer: PublicKey, nftSource: PublicKey, nftMint: PublicKey): TransactionInstruction
  ```

- **`transferDomain`** — retrieves the current owner and returns one transfer instruction.

  ```ts
  transferDomain(connection: Connection, domain: string, newOwner: PublicKey): Promise<TransactionInstruction>
  ```

- **`burnDomain`** — returns one burn instruction; `target` receives reclaimed lamports.

  ```ts
  burnDomain(domain: string, owner: PublicKey, target: PublicKey): TransactionInstruction
  ```

- **`setPrimaryDomain`** — returns one instruction for an already derived domain account.

  ```ts
  setPrimaryDomain(connection: Connection, nameAccount: PublicKey, owner: PublicKey): Promise<TransactionInstruction>
  ```

- **`setBackground`** — returns the instructions required to set an issued custom background.

  ```ts
  setBackground(connection: Connection, domain: string, bg: CustomBg, owner: PublicKey): Promise<TransactionInstruction[]>
  ```

### Subdomains

- **`createSubdomain`** — returns the name-account creation instruction and, when the reverse account is absent, a reverse-lookup instruction. `subdomain` must be a lowercase one-level `.sns` subdomain.

  ```ts
  createSubdomain(connection: Connection, subdomain: string, owner: PublicKey, space?: number, feePayer?: PublicKey): Promise<TransactionInstruction[]>
  ```

- **`transferSubdomain`** — returns one transfer instruction. When `owner` is omitted, the function retrieves the current owner; set `isParentOwnerSigner` when the parent owner authorizes the transfer.

  ```ts
  transferSubdomain(connection: Connection, subdomain: string, newOwner: PublicKey, isParentOwnerSigner?: boolean, owner?: PublicKey): Promise<TransactionInstruction>
  ```

- **`findSubdomains`** — returns reverse-resolved subdomain labels for a parent name-account key.

  ```ts
  findSubdomains(connection: Connection, parentKey: PublicKey): Promise<string[]>
  ```

### Ownership And Reverse Lookup

- **`getSnsDomainKeysForOwner`** — returns directly registry-owned top-level name-account keys.

  ```ts
  getSnsDomainKeysForOwner(connection: Connection, wallet: PublicKey): Promise<PublicKey[]>
  ```

- **`getSnsDomainsForOwner`** — adds TLD-less reverse names to those directly owned keys; it excludes tokenized domains, subdomains, and entries without reverse data.

  ```ts
  getSnsDomainsForOwner(connection: Connection, wallet: PublicKey): Promise<{ domain: string; key: PublicKey }[]>
  ```

- **`getSnsNftsForOwner`** — returns tokenized domains with reverse data.

  ```ts
  getSnsNftsForOwner(connection: Connection, owner: PublicKey): Promise<{ domain: string; key: PublicKey; mint: PublicKey }[]>
  ```

- **`getAllSnsDomains`** — returns raw top-level registry program accounts whose `account.data` is sliced to the 32-byte registry-owner field.

  ```ts
  getAllSnsDomains(connection: Connection): Promise<GetProgramAccountsResponse>
  ```

- **`getPrimaryDomain`** — returns the primary name-account key, TLD-less reverse name, and stale status.

  ```ts
  getPrimaryDomain(connection: Connection, owner: PublicKey): Promise<{ domain: PublicKey; reverse: string; stale: boolean }>
  ```

- **`getMultiplePrimaryDomains`** — returns TLD-less primary names in input order; missing entries are `undefined`.

  ```ts
  getMultiplePrimaryDomains(connection: Connection, wallets: PublicKey[]): Promise<(string | undefined)[]>
  ```

- **`reverseLookup`** — returns one TLD-less reverse name.

  ```ts
  reverseLookup(connection: Connection, nameAccount: PublicKey, parent?: PublicKey): Promise<string>
  ```

- **`reverseLookupBatch`** — returns TLD-less names in input order; missing reverse records are `undefined`.

  ```ts
  reverseLookupBatch(connection: Connection, nameAccounts: PublicKey[]): Promise<(string | undefined)[]>
  ```

### Advanced APIs

For account-level integrations, the root export also includes derivation and raw name-registry helpers such as `getSnsDomainKeySync`, `getReverseKeySync`, `getReverseKeyFromDomainKey`, `getHashedNameSync`, `getNameAccountKeySync`, `createNameRegistry`, `updateNameRegistry`, `deleteNameRegistry`, and `createReverse`.

NFT helpers and state classes include domain-mint/owner/record retrieval, `NameRegistryState`, `PrimaryDomain`, and NFT state exports. `CustomBg`, `getCustomBgKeys`, and `setBackground` support issued custom backgrounds. The `devnet` export provides devnet-specific bindings and constants. Low-level instruction classes and raw state decoders are also exported for specialized integrations.

Legacy Twitter registry APIs remain exported for advanced compatibility use. They are not part of the recommended domain-resolution or registration path.

## Documentation And Migration

- [Developer documentation](https://dev.sns.id/)
- [v4 migration guide](./CHANGELOG.md)
- [SNS React v4 README](../react/README.md)
- [SDK monorepo overview](../README.md)
- [SNS guide](https://guide.sns.id/)

## License

This project is available under the [MIT License](../LICENSE).
