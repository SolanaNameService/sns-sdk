import '../constants/records.dart';
import '../states/record.dart';

/// Get default verifier for a record
///
/// This function mirrors js-kit/src/record/verifyRecordRightOfAssociation.ts _getDefaultVerifier
///
/// [record] - The record type
/// [state] - The record state
///
/// Returns the default verifier bytes or null if none available
List<int>? getDefaultVerifier({
  required Record record,
  required RecordState state,
}) {
  // For most record types, return null (no default verifier)
  // This would be expanded based on the specific record type logic
  return null;
}

/// Verify right of association synchronously
///
/// This function mirrors js-kit/src/record/verifyRecordRightOfAssociation.ts _verifyRoaSync
///
/// [record] - The record type
/// [state] - The record state
/// [verifier] - The verifier bytes
///
/// Returns true if the right of association is valid
bool verifyRoaSync({
  required Record record,
  required RecordState state,
  required List<int> verifier,
}) {
  final roaId = state.getRoAId();

  // Simple comparison for now - in a full implementation this would
  // include cryptographic verification based on the record type
  return _uint8ArraysEqual(verifier, roaId.toList());
}

/// Helper function to check if two byte arrays are equal
bool _uint8ArraysEqual(List<int> a, List<int> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}
