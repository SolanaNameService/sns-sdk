import 'dart:typed_data';
import 'package:solana/solana.dart' hide RpcClient;
import '../constants/addresses.dart';

/// Gets the Pyth feed account key
///
/// This function mirrors js/src/utils/getPythFeedAccountKey.ts
///
/// [shard] - The shard number
/// [priceFeed] - The price feed as list of integers
///
/// Returns the derived Pyth feed account public key
Future<Ed25519HDPublicKey> getPythFeedAccountKey(
  int shard,
  List<int> priceFeed,
) async {
  final buffer = ByteData(2);
  buffer.setUint16(0, shard, Endian.little);

  final seeds = [
    buffer.buffer.asUint8List(),
    Uint8List.fromList(priceFeed),
  ];

  final programAddress = Ed25519HDPublicKey.fromBase58(defaultPythPushProgram);

  final result = await Ed25519HDPublicKey.findProgramAddress(
    seeds: seeds,
    programId: programAddress,
  );

  return result;
}
