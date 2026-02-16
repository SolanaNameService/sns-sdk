import '../constants/addresses.dart';
import '../constants/records.dart';
import '../errors/sns_errors.dart';
import '../utils/derive_address.dart';

/// Result containing derived domain address and metadata.
class DomainAddressResult {
  /// Creates a domain address result.
  const DomainAddressResult({
    required this.domainAddress,
    required this.isSub,
    this.parentAddress,
    this.isSubRecord = false,
  });

  /// The derived on-chain address for the domain.
  final String domainAddress;

  /// The parent domain address (for subdomains).
  final String? parentAddress;

  /// Whether this domain is a subdomain.
  final bool isSub;

  /// Whether this represents a subdomain record.
  final bool isSubRecord;
}

/// Parameters for domain address derivation.
class GetDomainAddressParams {
  /// Creates parameters for domain address derivation.
  const GetDomainAddressParams({
    required this.domain,
    this.record,
  });

  /// The domain name to derive address for (with or without .sol suffix).
  final String domain;

  /// Record version for record-specific addresses (optional).
  final RecordVersion? record;
}

/// Derives the on-chain address for a domain, subdomain, or record.
///
/// Computes the Program Derived Address (PDA) for any .sol domain or subdomain.
/// Supports both standard domains and record-specific addresses.
///
/// Example:
/// ```dart
/// // Get main domain address
/// final result = await getDomainAddress(
///   GetDomainAddressParams(domain: 'bonfida'));
/// print(result.domainAddress); // On-chain address
///
/// // Get subdomain address
/// final subResult = await getDomainAddress(
///   GetDomainAddressParams(domain: 'sub.bonfida'));
/// print(subResult.isSub); // true
/// ```
///
/// [params] Domain name and optional record version.
///
/// Returns [DomainAddressResult] with address and metadata.
Future<DomainAddressResult> getDomainAddress(
    GetDomainAddressParams params) async {
  var domain = params.domain;
  final record = params.record;

  // Remove .sol suffix if present
  if (domain.endsWith('.sol')) {
    domain = domain.substring(0, domain.length - 4);
  }

  final recordClass =
      record == RecordVersion.v2 ? centralStateDomainRecords : null;
  final recordPrefix = _getRecordPrefix(record);
  final splitted = domain.split('.');

  if (splitted.length == 2) {
    // Subdomain case (e.g., "sub.example")
    final parentAddress = await deriveAddress(
      splitted[1],
      parentAddress: rootDomainAddress,
    );
    final domainAddress = await deriveAddress(
      recordPrefix + splitted[0],
      parentAddress: parentAddress,
      classAddress: recordClass,
    );

    return DomainAddressResult(
      domainAddress: domainAddress,
      parentAddress: parentAddress,
      isSub: true,
    );
  } else if (splitted.length == 3 && record != null) {
    // Sub-record case (e.g., "record.sub.example")
    // Parent domain
    final parentAddress = await deriveAddress(
      splitted[2],
      parentAddress: rootDomainAddress,
    );

    // Sub domain
    final subAddress = await deriveAddress(
      '\x00${splitted[1]}',
      parentAddress: parentAddress,
    );

    // Sub record
    final domainAddress = await deriveAddress(
      recordPrefix + splitted[0],
      parentAddress: subAddress,
      classAddress: recordClass,
    );

    return DomainAddressResult(
      domainAddress: domainAddress,
      parentAddress: parentAddress,
      isSub: true,
      isSubRecord: true,
    );
  } else if (splitted.length >= 3) {
    throw InvalidInputError('The domain is malformed');
  }

  // Simple domain case (e.g., "example")
  final domainAddress = await deriveAddress(
    domain,
    parentAddress: rootDomainAddress,
  );

  return DomainAddressResult(
    domainAddress: domainAddress,
    isSub: false,
  );
}

/// Gets the record prefix for a given record version
String _getRecordPrefix(RecordVersion? record) {
  switch (record) {
    case RecordVersion.v2:
      return '\x02';
    case RecordVersion.v1:
      return '\x01';
    case null:
      return '\x00';
  }
}
