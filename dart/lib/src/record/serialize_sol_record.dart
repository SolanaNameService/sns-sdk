import 'dart:convert';
import 'dart:typed_data';

import 'package:cryptography/cryptography.dart';
import 'package:solana/solana.dart';

import '../errors/sns_errors.dart';

/// Serializes a SOL record with signature verification
///
/// This function mirrors js/src/record/serializeSolRecord.ts exactly
/// Builds the content of a SOL record with signature validation
///
/// [content] - The public key being stored in the SOL record
/// [recordKey] - The record public key
/// [signer] - The signer of the record (domain owner)
/// [signature] - The signature of the record's content
///
/// Returns Uint8List containing the serialized SOL record
///
/// Throws [InvalidSignatureError] if SOL signature is invalid
Future<Uint8List> serializeSolRecord(
  Ed25519HDPublicKey content,
  Ed25519HDPublicKey recordKey,
  Ed25519HDPublicKey signer,
  Uint8List signature,
) async {
  // Create expected data: content + recordKey
  final contentBytes = content.bytes;
  final recordKeyBytes = recordKey.bytes;
  final expected = Uint8List.fromList([...contentBytes, ...recordKeyBytes]);

  // Encode as hex string then to UTF-8 bytes for verification
  final hexString =
      expected.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
  final encodedMessage = utf8.encode(hexString);

  // Verify signature using Ed25519
  final isValid = await _checkSolRecord(encodedMessage, signature, signer);
  if (!isValid) {
    throw SnsError(ErrorType.invalidSignature, 'The SOL signature is invalid');
  }

  // Return content + signature (total 64 bytes: 32 + 32)
  return Uint8List.fromList([...contentBytes, ...signature]);
}

/// Verifies the validity of a SOL record signature
///
/// This function mirrors js/src/record/checkSolRecord.ts
///
/// [record] - The record data to verify
/// [signedRecord] - The signed data (signature)
/// [pubkey] - The public key of the signer
///
/// Returns true if signature is valid
Future<bool> _checkSolRecord(
  Uint8List record,
  Uint8List signedRecord,
  Ed25519HDPublicKey pubkey,
) async {
  try {
    // Basic validation: check that we have valid inputs
    if (record.isEmpty || signedRecord.isEmpty) {
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
      pubkey.bytes,
      type: KeyPairType.ed25519,
    );

    // Create signature object
    final signature = Signature(
      signedRecord,
      publicKey: publicKey,
    );

    // Verify the signature
    final isValid = await ed25519.verify(record, signature: signature);
    return isValid;
  } on Exception {
    return false;
  }
}
