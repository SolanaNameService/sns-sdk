<p align="center">
<img width="250" src="https://v2.sns.id/assets/logo/brand.svg"/>
</p>

# SNS JS-KIT SDK

![npm version](https://img.shields.io/npm/v/@solana-name-service/sns-sdk-kit)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![License](https://img.shields.io/github/license/SolanaNameService/sns-sdk)

The JS-KIT SDK is a JavaScript toolkit for managing SNS domains and records. Built on `@solana/kit` (formerly `@solana/web3.js` 2.x), it provides typed helpers for resolving domains, reading records, and building domain or record operations.

## Features

- Resolve `.sns` and `.sol` domains
- Look up domain owners, primary domains, and domains owned by an address
- Read and deserialize domain records
- Work with subdomains, reverse lookups, and SNS domain NFTs
- Create, update, transfer, and delete domains or records through typed helpers
- TypeScript support with ESM and CommonJS builds

## Installation

```bash
npm install @solana-name-service/sns-sdk-kit@beta @solana/kit
```

```bash
yarn add @solana-name-service/sns-sdk-kit@beta @solana/kit
```

## Requirements

`@solana/kit` is a peer dependency. Most read helpers expect an RPC client created with `createSolanaRpcFromTransport`.

```typescript
import {
  createDefaultRpcTransport,
  createSolanaRpcFromTransport,
} from "@solana/kit";

const transport = createDefaultRpcTransport({
  url: "https://api.mainnet-beta.solana.com",
});
const rpc = createSolanaRpcFromTransport(transport);
```

Write helpers follow the normal Solana transaction and signing flow. For more complete examples, see the [`tests`](./tests) directory.

## Quick Start

```typescript
import {
  Record,
  getDomainRecord,
  getPrimaryDomain,
  resolve,
} from "@solana-name-service/sns-sdk-kit";
import {
  Address,
  createDefaultRpcTransport,
  createSolanaRpcFromTransport,
} from "@solana/kit";

(async () => {
  const transport = createDefaultRpcTransport({
    url: "https://api.mainnet-beta.solana.com",
  });
  const rpc = createSolanaRpcFromTransport(transport);

  const resolvedAddress = await resolve({ rpc, domain: "wallet-guide-9.sns" });

  const urlRecord = await getDomainRecord({
    rpc,
    domain: "wallet-guide-9.sns",
    record: Record.Url,
    options: { deserialize: true },
  });

  const primaryDomain = await getPrimaryDomain({
    rpc,
    walletAddress: "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4" as Address,
  });

  console.log({
    resolvedAddress,
    url: urlRecord.deserializedContent,
    primaryDomain,
  });
})();
```

## Available APIs

- Domain: `resolve`, `getDomainAddress`, `getDomainOwner`, `getDomainRecord`, `getDomainRecords`, `getSubdomains`, `getAllSnsDomains`
- Address: `getPrimaryDomain`, `getPrimaryDomainsBatch`, `getSnsDomainsForAddress`, `getSnsNftsForAddress`
- Records: `getRecordV1Address`, `getRecordV2Address`, `verifyRecordRightOfAssociation`, `verifyRecordStaleness`
- NFTs: `getSnsNftMint`, `getSnsNftOwner`
- Instructions: low-level instruction builders for composing custom transactions
- Utilities: record serialization/deserialization, reverse lookup, TLD helpers, constants, codecs, states, errors, and types

### Bindings

- Domain: `registerDomain`, `registerDomainWithNft`, `transferDomain`, `burnDomain`, `setPrimaryDomain`
- Subdomain: `createSubdomain`, `transferSubdomain`
- Records: `createRecord`, `updateRecord`, `deleteRecord`, `setRecordRoaVerifier`, `setRecordStalenessVerifier`, `validateRecordRoa`, `validateRecordRoaEthereum`
- Raw name registry: `createNameRegistry`, `updateNameRegistry`, `deleteNameRegistry`
- Reverse lookup: `createReverse`

Example `registerDomain` call:

```typescript
import { registerDomain } from "@solana-name-service/sns-sdk-kit";

const instructions = await registerDomain({
  domain: "mydomain.sns",
  space: 1_000,
  buyer,
  buyerTokenAccount,
  referrer,
});
```

## Documentation

General SNS documentation is available at [guide.sns.id](https://guide.sns.id). For additional SDK usage examples, see the [`tests`](./tests) directory.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
