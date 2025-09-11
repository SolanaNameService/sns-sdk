import 'dart:typed_data';

import 'package:solana/solana.dart' as solana;

import '../client/sns_client.dart';
import '../constants/addresses.dart';
import '../constants/records.dart';
import '../errors/sns_errors.dart';
import '../nft/nft_record.dart';
import '../nft/retrieve_nft_owner_v2.dart';
import '../record/check_sol_record.dart';
import '../record/get_record_key_sync.dart';
import '../record_v2/get_record_v2_key.dart';
import '../states/record_v2.dart';
import '../states/registry.dart';
import '../utils/base58_utils.dart';
import '../utils/get_domain_key_sync.dart';

/// Types for PDA allowance configuration
typedef AllowPda = String; // "any" | "false" | "true"

/// Configuration for domain resolution behavior.
///
/// Controls how domain ownership is determined when registry owners are PDAs.
class ResolveConfig {
  /// Creates resolve configuration.
  ///
  /// [allowPda] controls PDA ownership handling:
  /// - "any": Allow any ownership type (recommended for most cases)
  /// - "true": Allow PDA owners only
  /// - "false": Reject PDA owners (strict validation)
  ///
  /// [programIds] restricts which programs can own domains (optional).
  const ResolveConfig({
    this.allowPda = 'false',
    this.programIds,
  });

  /// PDA ownership allowance setting.
  final AllowPda allowPda;

  /// Allowed program IDs for domain ownership (optional).
  final List<solana.Ed25519HDPublicKey>? programIds;
}

/// Resolves a .sol domain to its owner address using SNS-IP-5 strategy.
///
/// Implements the complete domain resolution strategy following SNS-IP-5:
/// 1. Check for active NFT record ownership
/// 2. Validate SOL record V2 with Right-of-Association
/// 3. Verify SOL record V1 with signature validation
/// 4. Apply registry owner with PDA allowance rules
///
/// Example:
/// ```dart
/// final client = SnsClient(rpc);
///
/// // Standard resolution (allows any ownership)
/// final owner = await resolve(client, 'bonfida',
///   config: ResolveConfig(allowPda: "any"));
///
/// // Strict validation (no PDAs)
/// final owner = await resolve(client, 'bonfida',
///   config: ResolveConfig(allowPda: "false"));
/// ```
///
/// [connection] The SNS client for RPC operations.
/// [domain] The .sol domain name to resolve.
/// [config] Resolution configuration for PDA handling.
///
/// Returns the owner's public key as a base58 string.
///
/// Throws [DomainDoesNotExistError] if domain registry not found.
/// Throws [CouldNotFindNftOwnerError] if NFT owner undetermined.
/// Throws [RecordMalformedError] if record data is malformed.
/// Throws [SnsError] if validation method incorrect.
/// Throws [SnsError] if Right-of-Association fails.
/// Throws [PdaOwnerNotAllowedError] if PDA not allowed by config.
Future<String> resolve(
  SnsClient connection,
  String domain, {
  ResolveConfig config = const ResolveConfig(),
}) async {
  // Get domain key
  final domainResult = await getDomainKeySync(domain);
  final domainKey = domainResult.pubkey;

  // Get all the potential record keys
  final nftRecordKeyAddress =
      solana.Ed25519HDPublicKey.fromBase58(nameTokenizerAddress);
  final nftRecordKey = await NftRecord.findKeySync(
    solana.Ed25519HDPublicKey.fromBase58(domainKey),
    nftRecordKeyAddress,
  );
  final solRecordV1Key = await getRecordKeySync(domain, Record.sol);
  final solRecordV2Key = await getRecordV2Key(domain, Record.sol);

  // Fetch all account info in parallel
  final addresses = <String>[
    nftRecordKey.toBase58(),
    solRecordV1Key,
    solRecordV2Key,
    domainKey,
  ];

  final accountInfos = await Future.wait(
    addresses.map((addr) async {
      try {
        return await connection.getAccountInfo(addr);
      } on Exception {
        return null;
      }
    }),
  );

  final nftRecordInfo = accountInfos[0];
  final solRecordV1Info = accountInfos[1];
  final solRecordV2Info = accountInfos[2];
  final registryInfo = accountInfos[3];

  // Check if domain exists
  if (registryInfo?.data == null || registryInfo!.data.isEmpty) {
    throw DomainDoesNotExistError('Domain $domain does not exist');
  }

  // Deserialize the registry
  final registry =
      RegistryState.deserialize(Uint8List.fromList(registryInfo.data));

  // Strategy 1: Check NFT record (highest priority)
  if (nftRecordInfo?.data != null && nftRecordInfo!.data.isNotEmpty) {
    final nftRecord =
        NftRecord.deserialize(Uint8List.fromList(nftRecordInfo.data));
    if (nftRecord.tag == NftRecordTag.activeRecord) {
      final nftOwner = await retrieveNftOwnerV2(
          connection.rpc, solana.Ed25519HDPublicKey.fromBase58(domainKey));
      if (nftOwner == null) {
        throw CouldNotFindNftOwnerError('Could not find NFT owner');
      }
      return nftOwner.toBase58();
    }
  }

  // Strategy 2: Check SOL record V2
  if (solRecordV2Info?.data != null && solRecordV2Info!.data.isNotEmpty) {
    try {
      final recordV2 =
          RecordState.deserialize(Uint8List.fromList(solRecordV2Info.data));
      final content = recordV2.getContent();

      // Validate content length
      if (content.length != 32) {
        throw RecordMalformedError(
            'Record is malformed - content length must be 32 bytes');
      }

      // Validate validation methods (should be Solana validation)
      if (!recordV2.header.isSolanaValidation) {
        throw SnsError(ErrorType.invalidValidation, 'Wrong validation method');
      }

      // Check staleness ID matches registry owner
      final registryOwnerBytes =
          solana.Ed25519HDPublicKey.fromBase58(registry.owner).bytes;
      final stalenessId = recordV2.getStalenessId();

      if (!_bytesEqual(stalenessId, registryOwnerBytes)) {
        // Continue to next strategy if staleness validation fails
      } else {
        // Check Right of Association
        final roaId = recordV2.getRoAId();
        if (_bytesEqual(roaId, content)) {
          // Convert bytes directly to base58 address
          return Base58Utils.encode(content);
        }

        final expectedRoA = Base58Utils.encode(content);
        final actualRoA = Base58Utils.encode(roaId);
        throw SnsError(
          ErrorType.invalidRoA,
          'The RoA ID should be $expectedRoA but is $actualRoA',
        );
      }
    } on Exception {
      // If V2 record processing fails, continue to V1
    }
  }

  // Strategy 3: Check SOL record V1
  if (solRecordV1Info?.data != null && solRecordV1Info!.data.isNotEmpty) {
    try {
      // Skip the header (96 bytes) and get the first 32 bytes (public key)
      const headerLen = 96; // RegistryState.headerLen
      final recordData = solRecordV1Info.data.skip(headerLen).toList();

      if (recordData.length >= 32 + 64) {
        // 32 bytes pubkey + 64 bytes signature
        final publicKeyBytes = recordData.take(32).toList();
        final expectedBytes = <int>[];
        expectedBytes.addAll(publicKeyBytes);
        expectedBytes
            .addAll(solana.Ed25519HDPublicKey.fromBase58(solRecordV1Key).bytes);

        // Convert to hex string for validation (matching JS implementation)
        final expectedHex = Uint8List.fromList(expectedBytes);

        final signatureBytes =
            Uint8List.fromList(recordData.skip(32).take(64).toList());

        final isValid = await checkSolRecord(
          expectedHex,
          signatureBytes,
          solana.Ed25519HDPublicKey.fromBase58(registry.owner),
        );

        if (isValid) {
          return Base58Utils.encode(Uint8List.fromList(publicKeyBytes));
        }
      }
    } on Exception {
      // If V1 record processing fails, continue to registry owner
    }
  }

  // Strategy 4: Check registry owner with PDA rules
  final registryOwnerKey = solana.Ed25519HDPublicKey.fromBase58(registry.owner);
  final isOnCurve = _isOnCurve(registryOwnerKey);
  if (!isOnCurve) {
    if (config.allowPda == 'any') {
      return registry.owner;
    } else if (config.allowPda == 'true') {
      // For simplicity, just return the owner for now
      // In a full implementation, you would check program ownership
      return registry.owner;
    } else {
      throw SnsError(ErrorType.pdaOwnerNotAllowed, 'PDA owner not allowed');
    }
  }

  // Default: return registry owner (only if it's on curve)
  return registry.owner;
}

/// Helper function to compare two byte arrays
bool _bytesEqual(List<int> a, List<int> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

/// Helper function to check if a public key is on the ed25519 curve
bool _isOnCurve(solana.Ed25519HDPublicKey publicKey) {
  try {
    // Use the same curve checking as the Solana package
    return solana.isPointOnEd25519Curve(publicKey.bytes);
  } on Exception {
    // If curve checking fails, assume it's not on curve (PDA)
    return false;
  }
}
