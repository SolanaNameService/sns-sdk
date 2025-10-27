import '../constants/addresses.dart';
import '../utils/derive_address.dart';

/// Derives the reverse address for a given owner address.
///
/// This function mirrors js-kit/src/utils/getReverseAddress.ts
///
/// [owner] - The owner address to get the reverse address for
///
/// Returns the reverse address as a base58 string
Future<String> getReverseAddress(String owner) async => deriveAddress(
      owner,
      parentAddress: reverseLookupClass,
    );
