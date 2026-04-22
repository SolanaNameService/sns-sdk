import '../constants/records.dart';
import '../domain/get_domain_owner.dart';
import '../domain/get_domain_record.dart';
import '../errors/sns_errors.dart';
import '../record/get_record_v2_address.dart';
import '../rpc/rpc_client.dart';
import '../states/record.dart';
import '../utils/deserialize_record_content.dart';
import '../utils/verify_record_roa.dart';
import '../utils/verify_record_staleness.dart';

/// Options for getting domain records
class GetDomainRecordsOptions {
  const GetDomainRecordsOptions({
    this.deserialize = false,
    this.verifiers = const [],
  });

  /// Whether to deserialize the record content
  final bool deserialize;

  /// Custom verifiers for right of association (must match records length)
  final List<List<int>?> verifiers;
}

/// Parameters for getting domain records
class GetDomainRecordsParams {
  const GetDomainRecordsParams({
    required this.rpc,
    required this.domain,
    required this.records,
    this.options = const GetDomainRecordsOptions(),
  });

  /// The RPC client for blockchain interaction
  final RpcClient rpc;

  /// The domain whose records are to be retrieved
  final String domain;

  /// The types of records to retrieve
  final List<Record> records;

  /// Additional options for processing
  final GetDomainRecordsOptions options;
}

/// Retrieves multiple records under a domain, verifies their state, and optionally deserializes their content.
///
/// This function mirrors js-kit/src/domain/getDomainRecords.ts
///
/// [params] - Parameters containing RPC client, domain, record types, and options
///
/// Returns a promise that resolves to an array of results for the retrieved records, including their verification status and optionally their deserialized content.
Future<List<DomainRecordResult?>> getDomainRecords(
    GetDomainRecordsParams params) async {
  final verifiers = params.options.verifiers;
  if (verifiers.isNotEmpty && verifiers.length != params.records.length) {
    throw MissingVerifierError(
      'The number of verifiers must be the same as the number of records',
    );
  }

  final recordAddresses = await Future.wait(
    params.records.map((record) => getRecordV2Address(GetRecordV2AddressParams(
          domain: params.domain,
          record: record,
        ))),
  );

  final results = await Future.wait([
    getDomainOwner(GetDomainOwnerParams(
      rpc: params.rpc,
      domain: params.domain,
    )),
    RecordState.retrieveBatch(params.rpc, recordAddresses),
  ]);

  final domainOwner = results[0] as String;
  final states = results[1] as List<RecordState?>;

  return states.asMap().entries.map((entry) {
    final idx = entry.key;
    final state = entry.value;

    if (state == null) return null;

    final record = params.records[idx];
    final verifier = verifiers.isNotEmpty
        ? verifiers[idx]
        : getDefaultVerifier(record: record, state: state);

    final verified = RecordVerification(
      staleness: verifyStalenessSync(
        domainOwner: domainOwner,
        state: state,
      ),
      rightOfAssociation: verifier != null
          ? verifyRoaSync(
              record: record,
              state: state,
              verifier: verifier,
            )
          : null,
    );

    String? deserializedContent;
    if (params.options.deserialize) {
      deserializedContent = deserializeRecordContent(
        content: state.getContent(),
        record: record,
      );
    }

    return DomainRecordResult(
      record: record,
      retrievedRecord: state,
      verified: verified,
      deserializedContent: deserializedContent,
    );
  }).toList();
}
