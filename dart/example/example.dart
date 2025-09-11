import 'dart:developer' as developer;

import 'package:sns_sdk/sns_sdk.dart';

/// Example demonstrating basic SNS SDK usage
Future<void> main() async {
  // Initialize RPC client and SNS client
  final rpc = HttpRpcClient(const String.fromEnvironment(
    'RPC_URL',
    defaultValue: 'https://api.mainnet-beta.solana.com',
  ));
  final client = SnsClient(rpc);

  developer.log('SNS Dart SDK Example', name: 'sns_example');
  developer.log('==================', name: 'sns_example');

  try {
    // Example 1: Resolve domain to owner
    developer.log('\n1. Resolving domain "bonfida"...', name: 'sns_example');
    final owner = await resolve(
      client,
      'bonfida',
      config: const ResolveConfig(allowPda: 'any'),
    );
    developer.log('Owner: $owner', name: 'sns_example');

    // Example 2: Get domain address
    developer.log('\n2. Getting domain address...', name: 'sns_example');
    final result = await getDomainAddress(
      const GetDomainAddressParams(domain: 'bonfida'),
    );
    developer.log('Address: ${result.domainAddress}', name: 'sns_example');
    developer.log('Is subdomain: ${result.isSub}', name: 'sns_example');

    // Example 3: Get domain records
    developer.log('\n3. Getting domain records...', name: 'sns_example');
    final record = await getDomainRecord(GetDomainRecordParams(
      rpc: rpc,
      domain: 'bonfida',
      record: Record.sol,
      options: const GetDomainRecordOptions(deserialize: true),
    ));
    developer.log('SOL record: ${record.deserializedContent}',
        name: 'sns_example');
    developer.log('Is valid: ${record.verified.staleness}',
        name: 'sns_example');
  } on Exception catch (e) {
    developer.log('Error: $e', name: 'sns_example', level: 1000);
  }
}
