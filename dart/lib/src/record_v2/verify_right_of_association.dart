/// Right of Association (ROA) verification for Record V2
///
/// This module provides functionality to verify that a Record V2 has proper
/// right of association, following the exact implementation pattern of the JavaScript SDK.
library;

import 'dart:typed_data';
import 'package:solana/base58.dart';

import '../constants/records.dart';
import '../errors/sns_errors.dart';
import '../rpc/rpc_client.dart';
import '../states/record.dart';
import '../types/validation.dart';
import 'constants.dart' as v2_constants;
import 'get_record_v2_key.dart';

/// Gets the default verifier for a given record and record state
///
/// This determines the expected verifier based on the record type:
/// - Self-signed records: Uses the record content itself as verifier
/// - Guardian records: Uses the guardian public key as verifier
/// - Other records: No default verifier (must be specified)
Uint8List? getDefaultVerifier({
  required Record record,
  required RecordState state,
}) {
  if (v2_constants.selfSignedRecords.contains(record)) {
    return Uint8List.fromList(state.getContent());
  } else {
    final guardian = v2_constants.guardians[record];
    if (guardian != null) {
      // Convert guardian address from base58 string to bytes
      try {
        return Uint8List.fromList(base58decode(guardian));
      } on Exception {
        // Invalid base58 guardian address
        return null;
      }
    }
  }
  return null;
}

/// Verifies the right of association for a record synchronously
///
/// This function checks that the record's ROA ID matches the expected verifier
/// and that the validation type is correct for the record type.
///
/// @param record The record type being verified
/// @param state The record state containing ROA data
/// @param verifier The expected verifier (as bytes)
/// @returns true if the ROA is valid, false otherwise
bool verifyRoaSynchronous({
  required Record record,
  required RecordState state,
  required Uint8List verifier,
}) {
  final roaId = state.getRoAId();

  // Determine expected validation type based on record
  final expectedValidation = v2_constants.ethRoaRecords.contains(record)
      ? Validation.ethereum
      : Validation.solana;

  // Check if ROA ID matches verifier and validation type is correct
  return _areByteArraysEqual(roaId, verifier) &&
      state.header.rightOfAssociationValidation == expectedValidation;
}

/// Helper function to compare two byte arrays for equality
bool _areByteArraysEqual(List<int> a, List<int> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

/// Verification result for Record V2 right of association
class RecordRoaVerificationResult {
  const RecordRoaVerificationResult({
    required this.isValid,
    this.errorMessage,
    this.verifier,
    this.roaId,
  });

  /// Create a successful verification result
  factory RecordRoaVerificationResult.success({
    required Uint8List verifier,
    required List<int> roaId,
  }) =>
      RecordRoaVerificationResult(
        isValid: true,
        verifier: verifier,
        roaId: roaId,
      );

  /// Create a failed verification result
  factory RecordRoaVerificationResult.failure({
    required String errorMessage,
    Uint8List? verifier,
    List<int>? roaId,
  }) =>
      RecordRoaVerificationResult(
        isValid: false,
        errorMessage: errorMessage,
        verifier: verifier,
        roaId: roaId,
      );

  /// Whether the ROA verification passed
  final bool isValid;

  /// Error message if verification failed
  final String? errorMessage;

  /// The verifier that was used
  final Uint8List? verifier;

  /// The actual ROA ID from the record
  final List<int>? roaId;
}

/// Verifies the right of association for a Record V2
///
/// This function fetches the Record V2 account data and verifies that it has
/// proper right of association, matching the JavaScript SDK implementation exactly.
///
/// Note: This function does not verify if the record is stale. Users must verify
/// staleness in addition to the right of association.
///
/// Examples:
/// ```dart
/// final result = await verifyRightOfAssociation(
///   client,
///   'example.sol',
///   Record.eth,
/// );
///
/// if (result.isValid) {
///   print('ROA verification passed');
/// } else {
///   print('ROA verification failed: ${result.errorMessage}');
/// }
/// ```
///
/// @param connection The RPC client for blockchain interaction
/// @param domain The domain name to verify
/// @param record The record type to verify
/// @param verifier Optional custom verifier bytes. If not provided, uses default verifier
/// @returns RecordRoaVerificationResult containing verification status and details
/// @throws [AccountDoesNotExistError] if the record account does not exist
/// @throws [InvalidRecordDataError] if the record data is malformed
Future<RecordRoaVerificationResult> verifyRightOfAssociation(
  RpcClient connection,
  String domain,
  Record record, {
  Uint8List? verifier,
}) async {
  try {
    // Get the record key for this domain and record type
    final recordKey = await getRecordV2Key(domain, record);

    // Retrieve the record state
    final state = await RecordState.retrieve(connection, recordKey);

    // Determine the verifier to use
    final effectiveVerifier = verifier ??
        getDefaultVerifier(
          record: record,
          state: state,
        );

    if (effectiveVerifier == null) {
      return RecordRoaVerificationResult.failure(
        errorMessage:
            'You must specify the verifier for record type: ${record.name}',
      );
    }

    // Perform the ROA verification
    final isValid = verifyRoaSynchronous(
      record: record,
      state: state,
      verifier: effectiveVerifier,
    );

    final roaId = state.getRoAId();

    if (isValid) {
      return RecordRoaVerificationResult.success(
        verifier: effectiveVerifier,
        roaId: roaId,
      );
    } else {
      return RecordRoaVerificationResult.failure(
        errorMessage:
            'ROA verification failed: verifier mismatch or invalid validation type',
        verifier: effectiveVerifier,
        roaId: roaId,
      );
    }
  } on Exception catch (e) {
    if (e is SnsError) {
      return RecordRoaVerificationResult.failure(
        errorMessage: 'SNS error: ${e.toString()}',
      );
    }
    return RecordRoaVerificationResult.failure(
      errorMessage: 'Failed to verify ROA: $e',
    );
  }
}

/// Convenience function that returns a simple boolean result
///
/// This function is equivalent to verifyRightOfAssociation but returns
/// only the verification result as a boolean, matching the JavaScript SDK pattern.
///
/// @param connection The RPC client for blockchain interaction
/// @param domain The domain name to verify
/// @param record The record type to verify
/// @param verifier Optional custom verifier bytes
/// @returns true if ROA verification passes, false otherwise
Future<bool> verifyRightOfAssociationSimple(
  RpcClient connection,
  String domain,
  Record record, {
  Uint8List? verifier,
}) async {
  final result = await verifyRightOfAssociation(
    connection,
    domain,
    record,
    verifier: verifier,
  );
  return result.isValid;
}
