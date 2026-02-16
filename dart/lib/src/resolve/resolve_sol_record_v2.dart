import 'dart:typed_data';

import '../constants/records.dart';
import '../record_v2/get_record_v2_key.dart';
import '../rpc/rpc_client.dart';
import '../states/record_v2.dart';

/// Resolve SOL record V2 function
///
/// This function mirrors js/src/resolve/resolveSolRecordV2.ts
///
/// Resolves a SOL record V2 with proper validation according to the
/// SNS-IP 5 specification. The function validates both staleness
/// and right of association signatures.
///
/// [connection] - The RPC client for blockchain operations
/// [owner] - The current owner's public key bytes that must sign the staleness ID
/// [domain] - The domain name to resolve SOL record for
///
/// Returns the resolved public key bytes if validation passes, null otherwise
///
/// The record is considered valid if:
/// 1. stalenessId equals the owner's public key (staleness validation)
/// 2. stalenessValidation is set to 1 (Solana validation)
/// 3. roaId equals the record content (right of association validation)
/// 4. rightOfAssociationValidation is set to 1 (Solana validation)
Future<Uint8List?> resolveSolRecordV2(
  RpcClient connection,
  Uint8List owner,
  String domain,
) async {
  try {
    // Get the V2 record key for SOL record
    final recordV2Key = await getRecordV2Key(domain, Record.sol);

    // Get account info to retrieve the record data
    final accountInfo = await connection.fetchEncodedAccount(recordV2Key);
    if (!accountInfo.exists || accountInfo.data.isEmpty) {
      return null;
    }

    // Deserialize the record state
    final data = Uint8List.fromList(accountInfo.data);
    final solV2Record = RecordState.deserialize(data);

    // Get validation components
    final stalenessId = solV2Record.getStalenessId();
    final roaId = solV2Record.getRoAId();
    final content = solV2Record.getContent();

    // Validate staleness: record must be signed by current owner
    // stalenessValidation == 1 means Solana validation
    final isValidStaleness = _bytesEqual(stalenessId, owner) &&
        solV2Record.header.stalenessValidation == 1;

    // Validate right of association: record must be signed by destination
    // rightOfAssociationValidation == 1 means Solana validation
    final isValidRoa = _bytesEqual(roaId, content) &&
        solV2Record.header.rightOfAssociationValidation == 1;

    if (isValidStaleness && isValidRoa) {
      return content;
    }

    return null;
  } on Exception {
    // Other errors indicate the record doesn't exist or is invalid
    return null;
  }
}

/// Helper function to compare two byte arrays
bool _bytesEqual(Uint8List a, Uint8List b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}
