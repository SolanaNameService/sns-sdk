import '../rpc/rpc_client.dart';
import '../states/record.dart';
import '../utils/verify_record_staleness.dart';

/// Parameters for verifying record staleness
class VerifyRecordStalenessParams {
  const VerifyRecordStalenessParams({
    required this.rpc,
    required this.recordAddress,
  });

  /// The RPC client for blockchain interaction
  final RpcClient rpc;

  /// The record address to verify
  final String recordAddress;
}

/// Verify the staleness of a record asynchronously
///
/// This function mirrors js-kit/src/record/verifyRecordStaleness.ts
///
/// [params] - Parameters containing RPC client and record address
///
/// Returns true if the record staleness validation passes, false otherwise
Future<bool> verifyRecordStaleness(VerifyRecordStalenessParams params) async {
  final state = await RecordState.retrieve(params.rpc, params.recordAddress);

  // Extract domain owner from staleness ID
  final stalenessId = state.getStalenessId();
  final domainOwner = _base58Encode(stalenessId);

  return verifyStalenessSync(
    domainOwner: domainOwner,
    state: state,
  );
}

/// Base58 encode helper
String _base58Encode(List<int> input) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  if (input.isEmpty) return '';

  // Count leading zeros
  var leadingZeros = 0;
  for (var i = 0; i < input.length; i++) {
    if (input[i] == 0) {
      leadingZeros++;
    } else {
      break;
    }
  }

  // Convert to BigInt
  var value = BigInt.zero;
  for (var i = 0; i < input.length; i++) {
    value = value * BigInt.from(256) + BigInt.from(input[i]);
  }

  // Encode to base58
  final result = <String>[];
  final base = BigInt.from(58);

  while (value > BigInt.zero) {
    final remainder = (value % base).toInt();
    result.insert(0, alphabet[remainder]);
    value = value ~/ base;
  }

  // Add leading ones for leading zeros
  for (var i = 0; i < leadingZeros; i++) {
    result.insert(0, '1');
  }

  return result.join();
}
