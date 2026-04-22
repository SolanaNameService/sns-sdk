import 'dart:convert';
import 'dart:typed_data';

import 'package:solana/solana.dart' hide RpcClient;

import '../constants/records.dart';
import '../errors/sns_errors.dart';
import '../record/check_sol_record.dart';
import '../record/get_record_key_sync.dart';
import '../rpc/rpc_client.dart';

/// Resolves a SOL record V1 for a domain
///
/// This function mirrors js/src/resolve/resolveSolRecordV1.ts exactly
///
/// [connection] - The RPC client to use for blockchain communication
/// [owner] - The domain owner's public key (for signature verification)
/// [domain] - The domain name to resolve
///
/// Returns the Ed25519HDPublicKey stored in the SOL record
/// Throws [InvalidSignatureError] if verification fails
Future<Ed25519HDPublicKey> resolveSolRecordV1(
  RpcClient connection,
  Ed25519HDPublicKey owner,
  String domain,
) async {
  // Get the record key for the SOL record
  final recordKey = await getRecordKeySync(domain, Record.sol);

  // Get the SOL record data from the blockchain
  final recordInfo = await connection.fetchEncodedAccount(recordKey);

  if (!recordInfo.exists || recordInfo.data.isEmpty) {
    throw NoRecordDataError('The SOL record V1 data is empty');
  }

  // Skip the registry header (96 bytes) to get to the actual record data
  const headerLen = 96;
  if (recordInfo.data.length <= headerLen) {
    throw NoRecordDataError('The SOL record V1 data is too short');
  }

  final recordData = recordInfo.data.skip(headerLen).toList();

  if (recordData.length < 32 + 64) {
    // 32 bytes pubkey + 64 bytes signature
    throw NoRecordDataError('Invalid SOL record V1 data format');
  }

  // Prepare data for signature verification
  // Expected buffer: [32-byte public key][record key bytes]
  final expectedBytes = <int>[];
  expectedBytes.addAll(recordData.take(32)); // First 32 bytes (public key)
  expectedBytes.addAll(
      Ed25519HDPublicKey.fromBase58(recordKey).bytes); // Record key bytes

  // Convert to hex string then to UTF-8 bytes (matching JS Buffer.toString('hex'))
  final expectedHex =
      expectedBytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
  final expected = Uint8List.fromList(utf8.encode(expectedHex));

  // Extract signature (bytes 32 onwards, take 64 bytes)
  final signature = Uint8List.fromList(recordData.skip(32).take(64).toList());

  // Verify the signature using the domain owner as the signer
  final valid = await checkSolRecord(expected, signature, owner);

  if (!valid) {
    throw InvalidSignatureError('The SOL record V1 signature is invalid');
  }

  // Return the public key (first 32 bytes of the record data)
  final pubkeyBytes = recordData.take(32).toList();
  return Ed25519HDPublicKey(pubkeyBytes);
}
