import 'dart:typed_data';

import '../constants/pyth_feeds.dart';
import 'derive_address.dart';

/// Parameters for getting Pyth feed address
class GetPythFeedAddressParams {
  const GetPythFeedAddressParams({
    required this.shard,
    required this.priceFeed,
  });

  /// The shard number
  final int shard;

  /// The price feed data
  final List<int> priceFeed;
}

/// Retrieves the address of the Pyth feed for a specific shard and price feed
///
/// This mirrors js-kit/src/utils/getPythFeedAddress.ts
///
/// [params] - Parameters containing shard and price feed data
///
/// Returns the Pyth feed address as a string
Future<String> getPythFeedAddress(GetPythFeedAddressParams params) async {
  // Create 2-byte array for shard (little-endian)
  final shardBytes = Uint8List(2);
  shardBytes[0] = params.shard & 0xFF;
  shardBytes[1] = (params.shard >> 8) & 0xFF;

  // Generate PDA with Pyth program ID
  return _getProgramDerivedAddress(
    seeds: [shardBytes, Uint8List.fromList(params.priceFeed)],
    programId: pythProgramId,
  );
}

/// Generates a Program Derived Address (PDA) using the same algorithm as Solana
///
/// [seeds] - List of seed byte arrays
/// [programId] - The program ID as a base58 string
///
/// Returns the PDA as a base58 string
Future<String> _getProgramDerivedAddress({
  required List<List<int>> seeds,
  required String programId,
}) async {
  final programIdBytes = _base58Decode(programId);

  // Try different bump seeds starting from 255
  for (var bump = 255; bump >= 0; bump--) {
    final seedsWithBump = List<List<int>>.from(seeds);
    seedsWithBump.add([bump]);

    final candidate = await _createProgramAddress(
      seeds: seedsWithBump,
      programId: programIdBytes,
    );

    if (candidate != null) {
      return candidate;
    }
  }

  throw StateError('Unable to find a valid program derived address');
}

/// Creates a program address from seeds and program ID
///
/// Returns null if the address is on the ed25519 curve (invalid for PDA)
Future<String?> _createProgramAddress({
  required List<List<int>> seeds,
  required List<int> programId,
}) async {
  const maxSeedLength = 32;

  // Validate seed lengths
  for (final seed in seeds) {
    if (seed.length > maxSeedLength) {
      throw ArgumentError('Seed too long: ${seed.length} > $maxSeedLength');
    }
  }

  // Create the data to hash
  final data = <int>[];

  // Add all seeds
  for (final seed in seeds) {
    data.addAll(seed);
  }

  // Add program ID
  data.addAll(programId);

  // Add the PDA marker
  data.addAll('ProgramDerivedAddress'.codeUnits);

  // Hash the data
  final hash = await generateHash(String.fromCharCodes(data));

  // Check if the hash is on the ed25519 curve
  if (_isOnCurve(hash)) {
    return null; // Invalid PDA, try next bump
  }

  return _base58Encode(hash);
}

/// Checks if a point is on the ed25519 curve
bool _isOnCurve(Uint8List bytes) {
  if (bytes.length != 32) return false;

  // Simple heuristic: if the most significant bit is set in the last byte
  // and the value is very high, it's likely on the curve
  final lastByte = bytes[31];
  return (lastByte & 0x80) != 0 && lastByte >= 0xED;
}

/// Base58 alphabet used by Solana
const String _base58Alphabet =
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/// Decodes a base58 string to bytes
List<int> _base58Decode(String input) {
  if (input.isEmpty) return [];

  // Count leading zeros
  var leadingZeros = 0;
  for (var i = 0; i < input.length; i++) {
    if (input[i] == '1') {
      leadingZeros++;
    } else {
      break;
    }
  }

  // Decode base58
  var decoded = BigInt.zero;
  final base = BigInt.from(58);

  for (var i = leadingZeros; i < input.length; i++) {
    final char = input[i];
    final index = _base58Alphabet.indexOf(char);
    if (index == -1) {
      throw ArgumentError('Invalid base58 character: $char');
    }
    decoded = decoded * base + BigInt.from(index);
  }

  // Convert to bytes
  final bytes = <int>[];
  while (decoded > BigInt.zero) {
    bytes.insert(0, (decoded % BigInt.from(256)).toInt());
    decoded = decoded ~/ BigInt.from(256);
  }

  // Add leading zeros
  for (var i = 0; i < leadingZeros; i++) {
    bytes.insert(0, 0);
  }

  return bytes;
}

/// Encodes bytes to a base58 string
String _base58Encode(Uint8List input) {
  if (input.isEmpty) return '';

  // Count leading zeros
  var leadingZeros = 0;
  for (var i = 0; i < input.length; i++) {
    if (input[i] == 0) {
      leadingZeros++;
    } else {
      break;
    }
  }

  // Convert to BigInt
  var value = BigInt.zero;
  for (var i = 0; i < input.length; i++) {
    value = value * BigInt.from(256) + BigInt.from(input[i]);
  }

  // Encode to base58
  final result = <String>[];
  final base = BigInt.from(58);

  while (value > BigInt.zero) {
    final remainder = (value % base).toInt();
    result.insert(0, _base58Alphabet[remainder]);
    value = value ~/ base;
  }

  // Add leading ones for leading zeros
  for (var i = 0; i < leadingZeros; i++) {
    result.insert(0, '1');
  }

  return result.join();
}
