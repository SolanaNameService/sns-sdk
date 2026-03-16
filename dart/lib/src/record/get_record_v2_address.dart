import '../constants/addresses.dart';
import '../constants/records.dart';
import '../domain/get_domain_address.dart';
import '../utils/derive_address.dart';

/// Parameters for getting a V2 record address
class GetRecordV2AddressParams {
  const GetRecordV2AddressParams({
    required this.domain,
    required this.record,
  });

  /// The domain under which the record resides
  final String domain;

  /// The type of record to derive the address for
  final Record record;
}

/// Derives the address of a version 2 record.
///
/// This function mirrors js-kit/src/record/getRecordV2Address.ts
///
/// [params] - Parameters containing the domain and record type
///
/// Returns the derived record address
Future<String> getRecordV2Address(GetRecordV2AddressParams params) async {
  final domainResult = await getDomainAddress(GetDomainAddressParams(
    domain: params.domain,
  ));

  return deriveAddress(
    '\x02${params.record.name}',
    parentAddress: domainResult.domainAddress,
    classAddress: centralStateDomainRecords,
  );
}
