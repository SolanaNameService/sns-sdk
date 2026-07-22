# SNS SDK Proxy v1.0.0

This is a breaking release of the SNS SDK Proxy REST API.

Use this changelog as a migration guide from the legacy API to
v1.0.0.

## Table of contents

1. [Domain inputs and resolution](#1-domain-inputs-and-resolution)
2. [Updated endpoints](#2-updated-endpoints)
3. [Removed endpoints](#3-removed-endpoints)

## 1. Domain inputs and resolution

Proxy domain path and query values are TLD-less. Supply one label for a
top-level domain or two labels for a subdomain:

```text
mydomain
sub.mydomain
```

Do not include a final suffix:

```text
mydomain.sns
mydomain.sol
```

Values are trimmed and lowercased before use. SNS routes append `.sns`
internally, so a value such as `mydomain.sns` on a route that accepts two
labels is interpreted as `mydomain.sns.sns`; the proxy does not strip the
supplied suffix.

This contract applies to resolution, domain and reverse-key derivation,
record routes, registration, subdomain creation, and subdomain listing.
Registration accepts exactly one TLD-less label. Subdomain creation accepts
exactly two TLD-less labels.

### Resolution routes

The legacy `/resolve/:domain` route passed its domain value directly to the
underlying SDK. In v1, the route determines the TLD explicitly:

| Route                      | Resolved name      |
| -------------------------- | ------------------ |
| `/resolve/mydomain`        | `mydomain.sns`     |
| `/resolveSns/mydomain`     | `mydomain.sns`     |
| `/resolveSol/mydomain`     | `mydomain.sol`     |
| `/resolve/sub.mydomain`    | `sub.mydomain.sns` |
| `/resolveSol/sub.mydomain` | `sub.mydomain.sol` |

`/resolve` is functionally equivalent to `/resolveSns`: both resolve the
TLD-less input as an `.sns` domain through the SPL Name Service registry.
`/resolve` remains available for backward compatibility.

`/resolveSol` uses the legacy SNS-backed resolution path only while the
selected RPC endpoint reports a finalized slot below `452,825,395`. At or
after that slot, `.sol` resolution returns `400 Unsupported TLD` until
SRS-backed `.sol` resolution is enabled in a future SDK release.

**Action required:** Use `/resolve` or `/resolveSns` to resolve `.sns` domains.

## 2. Updated endpoints

### Record endpoints

The proxy record surface is now V2-only. Update routes as follows:

| Legacy route                     | v1 route                            |
| -------------------------------- | ----------------------------------- |
| `/record-key/:domain/:record`    | `/record-key-v2/:domain/:record`    |
| `/record/:domain/:record`        | `/record-v2/:domain/:record`        |
| `/records/:domain?records=<csv>` | `/records-v2/:domain?records=<csv>` |

There is no V1 record-reading or V1 record-key endpoint in v1.

#### Single-record responses

The legacy `/record` result was base64 record data. `/record-v2` returns a
structured result:

```json
{
  "s": "ok",
  "result": {
    "deserialized": "SDK-decoded content",
    "stale": false,
    "roa": true,
    "record": {
      "header": {},
      "data": "base64-encoded raw record bytes"
    }
  }
}
```

#### Batch-record responses

The legacy `/records` route returned positional `{ record, data }` entries.
`/records-v2` returns structured entries with `type`, `deserialized`, `stale`,
optional `roa`, and `record` fields.

Missing records are omitted. The output can therefore be shorter than the
requested CSV and must not be matched to inputs by array index. Match entries
using their `type` field instead. A batch accepts between 1 and 100 record
values.

**Action required:** Replace legacy record routes with their V2 equivalents.
For a single record, read decoded content from `result.deserialized`,
staleness from `result.stale`, and Right of Association verification from the
optional `result.roa`.

### Registration endpoint

Update `/register` query parameter names:

| Legacy parameter | v1 parameter |
| ---------------- | ------------ |
| `buyerStr`       | `buyer`      |
| `refKey`         | `referrer`   |
| `mintStr`        | `mint`       |

Before:

```http
GET /register?buyerStr=<PUBKEY>&domain=mydomain&space=1000
```

After:

```http
GET /register?buyer=<PUBKEY>&domain=mydomain&space=1000
```

The `domain` value must be one TLD-less label. `space` must be an integer from
`0` through `10000`. `buyer`, `referrer`, and `mint` must be base58 Solana
public keys when supplied.

**Action required:** Rename `buyerStr` to `buyer`, `refKey` to `referrer`, and
`mintStr` to `mint`. Ensure `domain`, `space`, and public-key values meet the
new validation requirements.

### Subdomain creation endpoint

`/create-sub` was replaced by `/create-subdomain`:

```http
GET /create-subdomain?owner=<PUBKEY>&subdomain=team.mydomain
```

The `subdomain` value must contain exactly two TLD-less labels. The legacy
`finalOwner` parameter and its appended transfer instruction were removed. If
the final owner must differ from `owner`, construct a separate ownership
transfer outside this proxy response.

**Action required:** Replace `/create-sub` with `/create-subdomain` and remove
`finalOwner`. Construct a separate ownership transfer when the final owner
must differ from `owner`.

### Serialized transaction responses

When `serialize=true`, `/register` and `/create-subdomain` now return a
base64-encoded unsigned legacy transaction in `result`:

```json
{
  "s": "ok",
  "result": "BASE64_TRANSACTION"
}
```

**Action required:** Stop parsing the legacy buffer-shaped JSON value. Base64
decode and deserialize `result`, inspect its instructions and account metas,
obtain every required signature, and submit it before its recent blockhash
expires.

### Reverse-key endpoint

`/reverse-key/:domain` no longer uses `?sub=true`. It determines whether the
name is a subdomain from the TLD-less input:

```http
GET /reverse-key/mydomain
GET /reverse-key/sub.mydomain
```

**Action required:** Remove the `sub` query parameter and pass exactly one label
for a top-level domain or two labels for a subdomain.

### Primary-domain route aliases

The API now exposes routes using primary-domain terminology:

| Primary-domain route                | Existing compatible route            |
| ----------------------------------- | ------------------------------------ |
| `/primary-domain/:owner`            | `/favorite-domain/:owner`            |
| `/multiple-primary-domains/:owners` | `/multiple-favorite-domains/:owners` |

**No action required:** The favorite-domain routes remain functional aliases.
New integrations should use the primary-domain route names.

## 3. Removed endpoints

The following legacy endpoints were removed:

| Removed endpoint                     | Replacement                                             |
| ------------------------------------ | ------------------------------------------------------- |
| `/twitter/get-handle-by-key/:key`    | Use a native SNS SDK or direct RPC access               |
| `/twitter/get-key-by-handle/:handle` | Use a native SNS SDK or direct RPC access               |
| `/domain-data/:domain`               | Fetch and decode the name account through an SDK or RPC |

**Action required:** Replace calls to these endpoints with the listed SDK or
RPC workflows. The proxy has no replacement routes for these operations.
