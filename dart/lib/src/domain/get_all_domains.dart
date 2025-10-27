import 'dart:typed_data';

import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';

/// Result containing domain address and owner
class DomainInfo {
  const DomainInfo({
    required this.domainAddress,
    required this.owner,
  });

  /// The domain address
  final String domainAddress;

  /// The domain owner address
  final String owner;
}

/// Parameters for getting all domains
class GetAllDomainsParams {
  const GetAllDomainsParams({
    required this.rpc,
    this.limit,
  });

  /// The RPC client for blockchain interaction
  final RpcClient rpc;

  /// Optional limit to the number of domains to retrieve
  final int? limit;
}

/// Retrieves the addresses of all .sol domains.
///
/// This function mirrors js-kit/src/domain/getAllDomains.ts
///
/// [params] - Parameters containing RPC client and optional limit
///
/// Returns a promise that resolves to an array of objects representing domain addresses and owners.
Future<List<DomainInfo>> getAllDomains(GetAllDomainsParams params) async {
  final accounts = await params.rpc.getProgramAccounts(
    nameProgramAddress,
    encoding: 'base64',
    filters: [
      const MemcmpFilter(
        offset: 0,
        bytes: rootDomainAddress,
        encoding: 'base58',
      ),
    ],
    dataSlice: const DataSlice(
      offset: 32,
      length: 32,
    ),
    limit: params.limit,
  );

  return accounts.map((account) {
    // Extract owner from account data (first 32 bytes)
    final ownerBytes = account.account.data.take(32).toList();
    final ownerAddress = _base58Encode(Uint8List.fromList(ownerBytes));

    return DomainInfo(
      domainAddress: account.pubkey,
      owner: ownerAddress,
    );
  }).toList();
}

/// Base58 encode helper
String _base58Encode(Uint8List input) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  if (input.isEmpty) return '';

  // Count leading zeros
  var leadingZeros = 0;
  for (var i = 0; i < input.length && input[i] == 0; i++) {
    leadingZeros++;
  }

  // Convert to base58
  final digits = <int>[0];
  for (final byte in input) {
    var carry = byte;
    for (var i = 0; i < digits.length; i++) {
      carry += digits[i] * 256;
      digits[i] = carry % 58;
      carry ~/= 58;
    }
    while (carry > 0) {
      digits.add(carry % 58);
      carry ~/= 58;
    }
  }

  // Build result string
  final result = StringBuffer();

  // Add leading '1's for leading zeros
  for (var i = 0; i < leadingZeros; i++) {
    result.write('1');
  }

  // Add base58 digits in reverse order
  for (var i = digits.length - 1; i >= 0; i--) {
    result.write(alphabet[digits[i]]);
  }

  return result.toString();
}
