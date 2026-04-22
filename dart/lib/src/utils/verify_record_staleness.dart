import '../constants/records.dart';
import '../domain/get_domain_owner.dart';
import '../record/get_record_v2_address.dart';
import '../rpc/rpc_client.dart';
import '../states/record.dart';
import '../types/validation.dart';

/// Verify record staleness synchronously
///
/// This function mirrors js-kit/src/record/verifyRecordStaleness.ts _verifyStalenessSync
///
/// [domainOwner] - The domain owner address
/// [state] - The record state to verify
///
/// Returns true if the record passes staleness validation
bool verifyStalenessSync({
  required String domainOwner,
  required RecordState state,
}) {
  final stalenessId = state.getStalenessId();
  final domainOwnerBytes = _base58Decode(domainOwner);

  return _uint8ArraysEqual(domainOwnerBytes, stalenessId.toList()) &&
      state.header.stalenessValidation == Validation.solana.index;
}

/// Parameters for verifying record staleness
class VerifyRecordStalenessParams {
  const VerifyRecordStalenessParams({
    required this.rpc,
    required this.domain,
    required this.record,
  });

  /// The RPC client for blockchain interaction
  final RpcClient rpc;

  /// The domain under which the record resides
  final String domain;

  /// The record to verify
  final Record record;
}

/// Verify record staleness asynchronously
///
/// This function mirrors js-kit/src/record/verifyRecordStaleness.ts verifyRecordStaleness
///
/// [params] - Parameters containing RPC client, domain, and record type
///
/// Returns true if the record is stale, false otherwise
Future<bool> verifyRecordStaleness(VerifyRecordStalenessParams params) async {
  final recordAddress = await getRecordV2Address(GetRecordV2AddressParams(
    domain: params.domain,
    record: params.record,
  ));

  final results = await Future.wait([
    getDomainOwner(GetDomainOwnerParams(
      rpc: params.rpc,
      domain: params.domain,
    )),
    RecordState.retrieve(params.rpc, recordAddress),
  ]);

  final domainOwner = results[0] as String;
  final state = results[1] as RecordState;

  return verifyStalenessSync(
    domainOwner: domainOwner,
    state: state,
  );
}

/// Helper function to check if two byte arrays are equal
bool _uint8ArraysEqual(List<int> a, List<int> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

/// Base58 decode helper
List<int> _base58Decode(String input) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  if (input.isEmpty) return [];

  // Count leading zeros
  var leadingZeros = 0;
  for (var i = 0; i < input.length; i++) {
    if (input[i] == '1') {
      leadingZeros++;
    } else {
      break;
    }
  }

  // Decode base58
  var decoded = BigInt.zero;
  final base = BigInt.from(58);

  for (var i = leadingZeros; i < input.length; i++) {
    final char = input[i];
    final index = alphabet.indexOf(char);
    if (index == -1) {
      throw ArgumentError('Invalid base58 character: $char');
    }
    decoded = decoded * base + BigInt.from(index);
  }

  // Convert to bytes
  final bytes = <int>[];
  while (decoded > BigInt.zero) {
    bytes.insert(0, (decoded % BigInt.from(256)).toInt());
    decoded = decoded ~/ BigInt.from(256);
  }

  // Add leading zeros
  for (var i = 0; i < leadingZeros; i++) {
    bytes.insert(0, 0);
  }

  return bytes;
}
