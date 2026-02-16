import '../constants/records.dart';
import '../domain/get_domain_address.dart';

/// Parameters for getting a V1 record address
class GetRecordV1AddressParams {
  const GetRecordV1AddressParams({
    required this.domain,
    required this.record,
  });

  /// The domain under which the record resides
  final String domain;

  /// The type of record to derive the address for
  final Record record;
}

/// Derives the address of a version 1 record.
///
/// This function mirrors js-kit/src/record/getRecordV1Address.ts
///
/// [params] - Parameters containing the domain and record type
///
/// Returns the derived record address
Future<String> getRecordV1Address(GetRecordV1AddressParams params) async {
  final result = await getDomainAddress(GetDomainAddressParams(
    domain: '${params.record.name}.${params.domain}',
    record: RecordVersion.v1,
  ));

  return result.domainAddress;
}
