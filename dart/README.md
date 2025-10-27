# SNS Dart SDK

Dart/Flutter SDK for the Solana Name Service (SNS) providing domain resolution, registration, and management functionality. This SDK maintains complete feature parity with the JavaScript SDK.

## Features

- **Domain Resolution**: Resolve .sol domains to owner addresses with full NFT and PDA support
- **Record Management**: Create, read, and verify domain records (SOL, ETH, URL, social media)
- **Subdomain Support**: Create and manage hierarchical subdomains  
- **NFT Integration**: Handle tokenized domains and NFT ownership
- **Right-of-Association**: Validate domain ownership with cryptographic proofs
- **Flutter Optimized**: Designed for mobile and web applications

## Installation

Add this to your package's `pubspec.yaml`:

```yaml
dependencies:
  sns_sdk: ^1.0.0
```

## Basic Usage

```dart
import 'package:sns_sdk/sns_sdk.dart';

Future<void> main() async {
  // Create RPC client
  final rpc = HttpRpcClient('https://api.mainnet-beta.solana.com');
  final client = SnsClient(rpc);
  
  // Resolve domain to owner
  final owner = await resolve(
    client, 
    'bonfida',
    config: ResolveConfig(allowPda: "any"),
  );
  print('Owner: $owner');
  
  // Get domain address
  final result = await getDomainAddress(
    GetDomainAddressParams(domain: 'bonfida'),
  );
  print('Address: ${result.domainAddress}');
  
  // Get domain records
  final record = await getDomainRecord(GetDomainRecordParams(
    rpc: rpc,
    domain: 'bonfida',
    record: Record.sol,
  ));
  print('SOL record: ${record.deserializedContent}');
}
```

## Core Concepts

### Domain Resolution (SNS-IP-5)

The SDK implements the SNS Improvement Proposal 5 resolution strategy:

1. **NFT Record**: Check for active NFT-based ownership
2. **SOL Record V2**: Validate with Right-of-Association (RoA)
3. **SOL Record V1**: Verify with signature validation
4. **Registry Owner**: Apply PDA allowance rules

```dart
// Allow any ownership type (recommended)
final owner = await resolve(client, 'domain', 
  config: ResolveConfig(allowPda: "any"));

// Strict validation (no PDAs)
final owner = await resolve(client, 'domain', 
  config: ResolveConfig(allowPda: "false"));
```

### Record Management

Domains can store various record types:

```dart
// Get SOL address record
final solRecord = await getDomainRecord(GetDomainRecordParams(
  rpc: rpc,
  domain: 'bonfida',
  record: Record.sol,
));

// Get social media records
final twitterRecord = await getDomainRecord(GetDomainRecordParams(
  rpc: rpc,
  domain: 'bonfida', 
  record: Record.twitter,
));
```

### Primary Domains

Get the primary domain for a wallet address:

```dart
final primaryDomain = await getPrimaryDomain(GetPrimaryDomainParams(
  rpc: rpc,
  walletAddress: 'FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ',
));
```

## API Reference

This SDK mirrors the [TypeScript SDK](https://github.com/Bonfida/sns-sdk) APIs. Core functions include:

- `resolve()` - Resolve domain to owner address
- `getDomainAddress()` - Get domain's on-chain address  
- `getDomainRecord()` - Get domain record data
- `getPrimaryDomain()` - Get primary domain for address
- `getNftsForAddress()` - Get tokenized domains for address
- `reverseLookupBatch()` - Reverse lookup addresses to domains

## Protocol Documentation

For detailed protocol information, see the [Solana Name Service documentation](https://docs.bonfida.org/collection/naming-service/overview).

## JavaScript SDK Parity

This Dart SDK maintains 100% feature parity with the official [JavaScript SDK](https://github.com/Bonfida/sns-sdk), ensuring consistent behavior across platforms.

## Testing

Run tests with:

```bash
dart test
```

## License

MIT License
