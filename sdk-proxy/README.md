<p align="center">
  <img width="200" src="https://www.sns.id/assets/logo/brand.svg" alt="SNS logo" />
</p>

# SNS SDK Proxy

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../LICENSE)

> **Experimental:** This Cloudflare Worker REST facade is for integrations that cannot use a native SDK. Its availability and API may change. It is a private package, not an installable SDK or a transaction relayer.

The proxy exposes selected [`@bonfida/spl-name-service`](../js/) operations over HTTP. The example production base URL is `https://sdk-proxy.sns.id`.

> **Migrating from the previous major version?** This release is not fully backward compatible. Review the [changelog](./CHANGELOG.md) for breaking changes and migration notes.

## Contents

- [Request conventions](#request-conventions)
- [Responses and errors](#responses-and-errors)
- [Resolution](#resolution)
- [Domain and key queries](#domain-and-key-queries)
- [Records](#records)
- [Instruction construction](#instruction-construction)
- [Deprecated aliases](#deprecated-aliases)
- [Documentation and migration](#documentation-and-migration)
- [License](#license)

## Request Conventions

All application endpoints are `GET` requests. There is no application authentication, and CORS is permissive (`Access-Control-Allow-Origin: *`). The Worker accepts `OPTIONS` through its CORS middleware; framework-generated `404` and `405` responses are not guaranteed to use the API envelope below.

`GET /` is a service-root exception: it returns the plain-text message `Visit https://github.com/Bonfida/sns-sdk`, rather than an API JSON envelope.

Domain path and query values are **TLD-less**. Supply `mydomain`, not `mydomain.sns`; routes append `.sns` unless their name explicitly says `Sol`. Values are trimmed and lowercased and must contain either one label (`mydomain`) or two non-empty labels (`sub.mydomain`). A value such as `mydomain.sns` is accepted as a two-label input and is treated as `mydomain.sns.sns` on an SNS route; do not include a final TLD in a proxy domain value. Registration and subdomain-listing inputs have stricter one-label and two-label requirements, respectively.

`owner`, `buyer`, `pubkey`, `referrer`, `mint`, and CSV owner values are base58 Solana public keys. Every RPC-backed route accepts an optional `rpc` query parameter. A non-empty `rpc` takes precedence over the Worker `RPC_URL` binding; RPC connections use `processed` commitment. Deterministic derivation and type routes do not need an RPC endpoint.

## Responses And Errors

Every application endpoint returns this envelope:

```ts
type ApiSuccess<T> = { s: "ok"; result: T };
type ApiError = { s: "error"; result: string };
type ApiResponse<T> = ApiSuccess<T> | ApiError;
```

A `200` response has `s: "ok"`; route tables below specify its `result` type. A primary-domain lookup without a configured primary domain is successful and returns `ApiSuccess<null>`.

Recurring result types are:

```ts
type DomainEntry = { domain: string; key: string };
type PrimaryDomainResult = {
  domain: string;
  reverse: string;
  stale: boolean;
};
type SerializedInstruction = {
  programId: string;
  keys: Array<{
    isSigner: boolean;
    isWritable: boolean;
    pubkey: string;
  }>;
  data: string; // base64
};
type RecordResult = {
  deserialized?: string;
  stale: boolean;
  roa?: boolean;
  record: {
    header: unknown;
    data: string; // base64
  };
};
```

| Status | Envelope result                                                                      | Meaning                                                                   |
| ------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `200`  | Route result                                                                         | Successful request, including `null` primary-domain results.              |
| `400`  | `Invalid input`, `Unsupported TLD`, or a deprecation message                         | Invalid schema input or selected SDK validation failures.                 |
| `404`  | `Domain not found`, `Record not found`, `Account not found`, or `Resource not found` | Requested chain data is absent.                                           |
| `422`  | `Record is malformed`                                                                | Record data or validation is malformed.                                   |
| `502`  | `RPC unavailable`                                                                    | Solana RPC returned a JSON-RPC error.                                     |
| `500`  | `Internal error`                                                                     | Any other failure, including a missing `RPC_URL` for an RPC-backed route. |

## Resolution

- **`GET /resolve/:domain`** — resolves `:domain.sns`.

  ```http
  GET /resolve/:domain
  ```

  Inputs: TLD-less domain or subdomain; optional `rpc`. Result: resolved owner public key.

- **`GET /resolveSns/:domain`** — explicit SNS alias with the same behavior as `/resolve`.

  ```http
  GET /resolveSns/:domain
  ```

  Inputs: TLD-less domain or subdomain; optional `rpc`. Result: resolved owner public key.

- **`GET /resolveSol/:domain`** — resolves `:domain.sol`; subject to the transition rule below.

  ```http
  GET /resolveSol/:domain
  ```

  Inputs: TLD-less domain or subdomain; optional `rpc`. Result: resolved owner public key.

`/resolveSol/:domain` uses the legacy SNS-backed path only while the selected RPC reports a finalized slot below `452,825,395`. At or after that slot, `.sol` is rejected as unsupported. SRS-backed `.sol` resolution is expected to be enabled in a future update.

## Domain And Key Queries

- **`GET /domain-key/:domain`** — deterministic; no RPC.

  ```http
  GET /domain-key/:domain
  ```

  Inputs: TLD-less domain or subdomain. Result: base58 SNS name-account key.

- **`GET /domains/:owner`** — combines directly owned and tokenized SNS domains. Entries lacking reverse-name data are omitted by the SDK.

  ```http
  GET /domains/:owner
  ```

  Inputs: `owner` base58 public key; optional `rpc`. Result: `DomainEntry[]`.

- **`GET /primary-domain/:owner`** — `stale` indicates that the configured owner no longer owns the domain.

  ```http
  GET /primary-domain/:owner
  ```

  Inputs: `owner` base58 public key; optional `rpc`. Result: `PrimaryDomainResult | null`.

- **`GET /favorite-domain/:owner`** — compatibility alias; it uses the primary-domain handler.

  ```http
  GET /favorite-domain/:owner
  ```

  Same inputs and result as `/primary-domain/:owner`.

- **`GET /multiple-primary-domains/:owners`** — the order follows the input CSV. Missing primary domains remain empty array positions in the underlying batch result.

  ```http
  GET /multiple-primary-domains/:owners
  ```

  Inputs: comma-separated, trimmed base58 public keys, 1 to 100; optional `rpc`. Result: `(string | null)[]`.

- **`GET /multiple-favorite-domains/:owners`** — compatibility alias; it uses the primary-domain batch handler.

  ```http
  GET /multiple-favorite-domains/:owners
  ```

  Same inputs and result as `/multiple-primary-domains/:owners`.

- **`GET /reverse-key/:domain`** — deterministic; no RPC. The route detects a subdomain from its two labels.

  ```http
  GET /reverse-key/:domain
  ```

  Inputs: TLD-less domain or subdomain. Result: base58 reverse-record key.

- **`GET /reverse-lookup/:pubkey`** — the input is a name-account key, not a wallet owner. It first retrieves the registry account to identify a parent.

  ```http
  GET /reverse-lookup/:pubkey
  ```

  Inputs: name-account `pubkey`; optional `rpc`. Result: reverse name string.

- **`GET /subdomains/:parent`** — parent must have exactly one label. Only subdomains with discoverable reverse records are returned; this can be an expensive program-account query.

  ```http
  GET /subdomains/:parent
  ```

  Inputs: TLD-less top-level `parent`; optional `rpc`. Result: array of human-readable subdomain labels.

## Records

Record routes use SNS V2 keys and append `.sns` to their TLD-less domain input. The accepted `:record` values and `records` CSV values are:

`IPFS`, `ARWV`, `SOL`, `ETH`, `BTC`, `LTC`, `DOGE`, `email`, `url`, `discord`, `github`, `reddit`, `twitter`, `telegram`, `pic`, `SHDW`, `POINT`, `BSC`, `INJ`, `backpack`, `A`, `AAAA`, `CNAME`, `TXT`, `background`, `BASE`, `IPNS`, and `bio`.

- **`GET /types/record`** — deterministic; no RPC. Use this route when machine-readable values are preferred.

  ```http
  GET /types/record
  ```

  Inputs: none. Result: record enum object containing the supported names and values.

- **`GET /record-key-v2/:domain/:record`** — deterministic; no RPC.

  ```http
  GET /record-key-v2/:domain/:record
  ```

  Inputs: TLD-less domain or subdomain; supported record value. Result: base58 V2 record key.

- **`GET /record-v2/:domain/:record`** — missing header accounts return `404`.

  ```http
  GET /record-v2/:domain/:record
  ```

  Inputs: TLD-less domain or subdomain; supported record value; optional `rpc`. Result: `RecordResult`.

- **`GET /records-v2/:domain?records=<csv>`** — missing records are deliberately omitted, so output is not positional and can be shorter than the input CSV.

  ```http
  GET /records-v2/:domain?records=<csv>
  ```

  Inputs: TLD-less domain or subdomain; comma-separated supported record values, 1 to 100; optional `rpc`. Result: `Array<{ type: string } & RecordResult>`.

A single record object has this shape:

```json
{
  "deserialized": "SDK-decoded content",
  "stale": false,
  "roa": true,
  "record": {
    "header": "SDK record header JSON",
    "data": "base64-encoded raw record bytes"
  }
}
```

`deserialized` is the decoded content when the record type supports it. `stale` is the inverse of the SDK staleness-verification result. `roa` is the right-of-association verification result and can be omitted when that verification does not apply. `record.header` is serialized directly from the underlying SDK and is therefore coupled to that SDK's header representation. `data` is always raw bytes encoded as base64.

## Instruction Construction

These endpoints return serialized transaction instructions, or an unsigned legacy transaction when `serialize=true`. The proxy never signs, sends, relays, or confirms a transaction. Inspect the returned account metas, build or deserialize the transaction, obtain every signature required by those metas, and submit the transaction before its recent blockhash expires.

When `serialize` is omitted or `false`, `result` is `SerializedInstruction[]`:

```json
[
  {
    "programId": "base58",
    "keys": [{ "isSigner": true, "isWritable": true, "pubkey": "base58" }],
    "data": "base64"
  }
]
```

With `serialize=true`, `result` is a base64-encoded unsigned legacy Solana transaction. The Worker sets its fee payer to the route's `buyer` or `owner` parameter and fetches a recent blockhash. It serializes with `requireAllSignatures: false` and `verifySignatures: false`; no signature is created or verified. Deserialize and inspect the transaction, then sign and submit it before the blockhash expires.

- **`GET /register`** — builds top-level `.sns` registration instructions. The buyer's associated token account is derived for the payment mint. Without `mint`, the route uses mainnet USDC. A supplied mint must have a configured Pyth feed or the route returns `400`; a supplied referrer is used only when it is a supported SDK referrer, otherwise registration proceeds without it. A supported referrer can add idempotent ATA creation.

  ```http
  GET /register
  ```

  Required query parameters: `buyer` (base58 public key), `domain` (one TLD-less label), `space` (integer `0` through `10000`). Optional: `serialize` (`true` or `false`), `referrer` (base58 public key), `mint` (base58 token mint), `rpc`.

- **`GET /create-subdomain`** — builds `.sns` subdomain creation instructions. Unlike the SDK default of 2,000 bytes, this proxy explicitly requests **zero-byte** subdomain allocation. It may also add a reverse-record instruction when none exists.

  ```http
  GET /create-subdomain
  ```

  Required query parameters: `owner` (base58 public key), `subdomain` (exactly two TLD-less labels, for example `team.mydomain`). Optional: `serialize` (`true` or `false`), `rpc`.

## Deprecated Aliases

- **`GET /record-key/:domain/:record`** — always returns `400`. Use `/record-key-v2/:domain/:record` instead.
- **`GET /record/:domain/:record`** — always returns `400`. Use `/record-v2/:domain/:record` instead.

## Documentation And Migration

- [Developer documentation](https://dev.sns.id/)
- [Migration guide](./CHANGELOG.md)
- [SNS monorepo overview](../README.md)
- [SNS guide](https://guide.sns.id/)

## License

This project is available under the [MIT License](../LICENSE).
