import 'dart:typed_data';

import 'package:cryptography/cryptography.dart';
import 'package:solana/solana.dart';

/// Verifies the validity of a SOL record signature
///
/// This function mirrors js/src/record/checkSolRecord.ts with strict parity
///
/// [record] - The record data to verify
/// [signedRecord] - The signed data (signature)
/// [pubkey] - The public key of the signer
///
/// Returns true if the signature is valid, false otherwise
Future<bool> checkSolRecord(
  Uint8List record,
  Uint8List signedRecord,
  Ed25519HDPublicKey pubkey,
) async {
  try {
    // Basic validation: check that we have valid inputs
    if (record.isEmpty || signedRecord.isEmpty || pubkey.bytes.isEmpty) {
      return false;
    }

    // Check signature length (ed25519 signatures are 64 bytes)
    if (signedRecord.length != 64) {
      return false;
    }

    // Check public key length (ed25519 public keys are 32 bytes)
    if (pubkey.bytes.length != 32) {
      return false;
    }

    // Use Ed25519 algorithm for signature verification
    final ed25519 = Ed25519();

    // Create SimplePublicKey from the pubkey bytes
    final publicKey = SimplePublicKey(
      pubkey.bytes, // Use .bytes instead of .toByteArray()
      type: KeyPairType.ed25519,
    );

    // Create signature object
    final signature = Signature(
      signedRecord,
      publicKey: publicKey,
    );

    // Verify the signature against the record data
    final isValid = await ed25519.verify(record, signature: signature);
    return isValid;
  } on Exception {
    // If verification fails due to any error, return false
    return false;
  }
}
