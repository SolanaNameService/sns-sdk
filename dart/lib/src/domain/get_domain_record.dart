import '../../sns_sdk.dart' show SnsError;
import '../constants/records.dart';
import '../domain/get_domain_owner.dart';
import '../errors/sns_errors.dart' show SnsError;
import '../record/get_record_v2_address.dart';
import '../rpc/rpc_client.dart';
import '../states/record.dart';
import '../utils/deserialize_record_content.dart';
import '../utils/verify_record_roa.dart';
import '../utils/verify_record_staleness.dart';

/// Result containing retrieved domain record and verification status.
class DomainRecordResult {
  /// Creates a domain record result.
  const DomainRecordResult({
    required this.record,
    required this.retrievedRecord,
    required this.verified,
    this.deserializedContent,
  });

  /// The record type that was requested.
  final Record record;

  /// The raw record state from blockchain.
  final RecordState retrievedRecord;

  /// Comprehensive verification status.
  final RecordVerification verified;

  /// Deserialized content string (if deserialize option enabled).
  final String? deserializedContent;
}

/// Record verification status with staleness and RoA validation.
class RecordVerification {
  /// Creates record verification status.
  const RecordVerification({
    required this.staleness,
    this.rightOfAssociation,
  });

  /// Whether record passes staleness validation (not expired).
  final bool staleness;

  /// Whether record passes Right-of-Association validation.
  final bool? rightOfAssociation;
}

/// Options for domain record retrieval and processing.
class GetDomainRecordOptions {
  /// Creates domain record options.
  const GetDomainRecordOptions({
    this.deserialize = false,
    this.verifier,
  });

  /// Whether to deserialize record content to readable string.
  final bool deserialize;

  /// Custom verifier public key for RoA validation (optional).
  final List<int>? verifier;
}

/// Parameters for domain record retrieval.
class GetDomainRecordParams {
  /// Creates domain record parameters.
  const GetDomainRecordParams({
    required this.rpc,
    required this.domain,
    required this.record,
    this.options = const GetDomainRecordOptions(),
  });

  /// RPC client for blockchain operations.
  final RpcClient rpc;

  /// Domain name to get record for.
  final String domain;

  /// Record type to retrieve (SOL, ETH, URL, social media, etc.).
  final Record record;

  /// Processing and verification options.
  final GetDomainRecordOptions options;
}

/// Retrieves and verifies a domain record with comprehensive validation.
///
/// Fetches the specified record type and performs complete verification:
/// - Staleness validation (ensures record not expired)
/// - Right-of-Association validation (verifies signature authenticity)
/// - Optional content deserialization for human-readable output
///
/// Example:
/// ```dart
/// // Get verified SOL address record
/// final result = await getDomainRecord(GetDomainRecordParams(
///   rpc: rpc,
///   domain: 'bonfida',
///   record: Record.sol,
///   options: GetDomainRecordOptions(deserialize: true),
/// ));
///
/// print('SOL Address: ${result.deserializedContent}');
/// print('Is Valid: ${result.verified.staleness}');
/// ```
///
/// [params] Domain, record type, and processing options.
///
/// Returns [DomainRecordResult] with record data and verification.
///
/// Throws [SnsError] if record account not found or invalid.
///   rpc: rpc,
///   domain: 'bonfida',
///   record: Record.sol,
/// ));
///
/// print('Record verified: ${result.verified.staleness}');
/// ```
Future<DomainRecordResult> getDomainRecord(GetDomainRecordParams params) async {
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

  final verifier = params.options.verifier ??
      getDefaultVerifier(
        record: params.record,
        state: state,
      );

  final verified = RecordVerification(
    staleness: verifyStalenessSync(
      domainOwner: domainOwner,
      state: state,
    ),
    rightOfAssociation: verifier != null
        ? verifyRoaSync(
            record: params.record,
            state: state,
            verifier: verifier,
          )
        : null,
  );

  String? deserializedContent;
  if (params.options.deserialize) {
    deserializedContent = deserializeRecordContent(
      content: state.getContent(),
      record: params.record,
    );
  }

  return DomainRecordResult(
    record: params.record,
    retrievedRecord: state,
    verified: verified,
    deserializedContent: deserializedContent,
  );
}
