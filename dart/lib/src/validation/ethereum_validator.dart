/// Ethereum address validation and RoA validation for cross-chain records
///
/// Provides validation utilities for Ethereum addresses and Right of Association (RoA)
/// verification for cross-chain record management in the SNS system.
library;

import 'dart:convert';
import 'dart:typed_data';

import 'package:crypto/crypto.dart';
import 'ethereum_signature_verifier.dart';

/// Exception thrown when Ethereum validation fails
class EthereumValidationError implements Exception {
  const EthereumValidationError(this.message, {this.address});
  final String message;
  final String? address;

  @override
  String toString() =>
      'EthereumValidationError: $message${address != null ? ' (address: $address)' : ''}';
}

/// Ethereum address and RoA validation utilities
class EthereumValidator {
  /// Regular expression for valid Ethereum address format (0x followed by 40 hex chars)
  static final RegExp _ethereumAddressRegex = RegExp(r'^0x[a-fA-F0-9]{40}$');

  /// Validates an Ethereum address format.
  ///
  /// @param address The Ethereum address to validate (with or without 0x prefix)
  /// @returns True if the address format is valid
  static bool isValidAddress(String address) {
    if (address.isEmpty) return false;

    // Add 0x prefix if missing
    final normalizedAddress = address.startsWith('0x') ? address : '0x$address';

    // Check format
    if (!_ethereumAddressRegex.hasMatch(normalizedAddress)) {
      return false;
    }

    // Validate checksum if mixed case
    if (_hasMixedCase(normalizedAddress)) {
      return _isValidChecksum(normalizedAddress);
    }

    return true;
  }

  /// Validates an Ethereum address and throws detailed error if invalid
  ///
  /// [address] - The Ethereum address to validate
  ///
  /// Throws [EthereumValidationError] if the address is invalid.
  static void validateAddressDetailed(String address) {
    if (address.isEmpty) {
      throw EthereumValidationError('Address cannot be empty',
          address: address);
    }

    final normalizedAddress = address.startsWith('0x') ? address : '0x$address';

    if (!_ethereumAddressRegex.hasMatch(normalizedAddress)) {
      throw EthereumValidationError('Invalid Ethereum address format',
          address: address);
    }

    if (_hasMixedCase(normalizedAddress) &&
        !_isValidChecksum(normalizedAddress)) {
      throw EthereumValidationError('Invalid address checksum',
          address: address);
    }
  }

  /// Normalizes an Ethereum address to lowercase with 0x prefix
  ///
  /// [address] - The Ethereum address to normalize
  ///
  /// Returns the normalized address.
  static String normalizeAddress(String address) {
    final normalized = address.startsWith('0x') ? address : '0x$address';
    return normalized.toLowerCase();
  }

  /// Converts an Ethereum address to checksum format (EIP-55)
  ///
  /// [address] - The Ethereum address to convert
  ///
  /// Returns the checksummed address.
  static String toChecksumAddress(String address) {
    final normalized = normalizeAddress(address);
    final addressHash =
        sha256.convert(utf8.encode(normalized.substring(2))).toString();

    final checksumAddress = StringBuffer('0x');

    for (var i = 0; i < 40; i++) {
      final char = normalized[i + 2];
      final hashChar = addressHash[i];

      if (int.parse(hashChar, radix: 16) >= 8) {
        checksumAddress.write(char.toUpperCase());
      } else {
        checksumAddress.write(char.toLowerCase());
      }
    }

    return checksumAddress.toString();
  }

  /// Validates Right of Association (RoA) for Ethereum records
  ///
  /// This validates that an Ethereum address is authorized to be associated
  /// with a SNS domain through cryptographic proof.
  ///
  /// [domain] - The SNS domain name
  /// [ethAddress] - The Ethereum address to validate
  /// [signature] - The signature proving the association
  /// [message] - Optional custom message (default constructed from domain and address)
  ///
  /// Returns true if the RoA is valid.
  static Future<bool> validateRoaEthereum(
    String domain,
    String ethAddress,
    List<int> signature, {
    String? message,
  }) async {
    try {
      await validateRoaEthereumDetailed(domain, ethAddress, signature,
          message: message);
      return true;
    } on EthereumValidationError {
      return false;
    }
  }

  /// Validates Right of Association (RoA) for Ethereum records with detailed errors
  ///
  /// [domain] - The SNS domain name
  /// [ethAddress] - The Ethereum address to validate
  /// [signature] - The signature proving the association
  /// [message] - Optional custom message (default constructed from domain and address)
  ///
  /// Throws [EthereumValidationError] if the RoA is invalid.
  static Future<void> validateRoaEthereumDetailed(
    String domain,
    String ethAddress,
    List<int> signature, {
    String? message,
  }) async {
    // Validate Ethereum address first
    validateAddressDetailed(ethAddress);

    // Validate domain format
    if (domain.isEmpty) {
      throw const EthereumValidationError('Domain cannot be empty');
    }

    // Validate signature format
    if (signature.length != 65) {
      throw const EthereumValidationError(
          'Ethereum signature must be 65 bytes long');
    }

    // Construct message if not provided
    final roaMessage = message ?? _constructRoaMessage(domain, ethAddress);

    // Create message hash for signing
    final messageHash = _createEthereumMessageHash(roaMessage);

    // Verify the signature
    final recoveredAddress =
        _recoverAddressFromSignature(messageHash, signature);

    if (recoveredAddress == null) {
      throw const EthereumValidationError(
          'Failed to recover address from signature');
    }

    final normalizedEthAddress = normalizeAddress(ethAddress);
    final normalizedRecovered = normalizeAddress(recoveredAddress);

    if (normalizedEthAddress != normalizedRecovered) {
      throw const EthereumValidationError(
          'Signature verification failed: recovered address does not match provided address');
    }
  }

  /// Creates a standard RoA message for domain and Ethereum address
  ///
  /// [domain] - The SNS domain name
  /// [ethAddress] - The Ethereum address
  ///
  /// Returns the standardized message string.
  static String createRoaMessage(String domain, String ethAddress) =>
      _constructRoaMessage(domain, ethAddress);

  /// Extracts the v, r, s components from an Ethereum signature
  ///
  /// [signature] - The 65-byte signature
  ///
  /// Returns a map with 'v', 'r', and 's' components.
  static Map<String, dynamic> extractSignatureComponents(List<int> signature) {
    if (signature.length != 65) {
      throw const EthereumValidationError('Signature must be 65 bytes long');
    }

    final r = signature.sublist(0, 32);
    final s = signature.sublist(32, 64);
    final v = signature[64];

    return {
      'r': r,
      's': s,
      'v': v,
    };
  }

  /// Checks if an address has mixed case (indicating it might be checksummed)
  static bool _hasMixedCase(String address) {
    final hex = address.substring(2);
    return hex != hex.toLowerCase() && hex != hex.toUpperCase();
  }

  /// Validates the checksum of an Ethereum address using EIP-55
  static bool _isValidChecksum(String address) {
    final checksummed = toChecksumAddress(address);
    return address == checksummed;
  }

  /// Constructs the standard RoA message format
  static String _constructRoaMessage(String domain, String ethAddress) {
    final normalizedAddress = normalizeAddress(ethAddress);
    return 'I authorize associating the Ethereum address $normalizedAddress with the Solana domain $domain.sol';
  }

  /// Creates an Ethereum message hash with the standard prefix
  static Uint8List _createEthereumMessageHash(String message) {
    final messageBytes = utf8.encode(message);
    final prefix =
        utf8.encode('\x19Ethereum Signed Message:\n${messageBytes.length}');

    final fullMessage = Uint8List.fromList([...prefix, ...messageBytes]);
    return Uint8List.fromList(sha256.convert(fullMessage).bytes);
  }

  /// Recovers the Ethereum address from a signature and message hash
  ///
  /// Recover Ethereum address from signature using production secp256k1 implementation
  ///
  /// Uses the robust EthereumSignatureVerifier for proper signature recovery.
  /// This replaces the previous placeholder implementation.
  static String? _recoverAddressFromSignature(
      Uint8List messageHash, List<int> signature) {
    try {
      // Convert signature to proper format
      if (signature.length != 65) return null;

      final signatureBytes = Uint8List.fromList(signature);

      // Extract signature components
      final r = signatureBytes.sublist(0, 32);
      final s = signatureBytes.sublist(32, 64);
      final v = signatureBytes[64];

      // Convert v to recovery ID
      final recoveryId = v >= 27 ? v - 27 : v;

      // Use our internal signature recovery method
      final publicKey = EthereumSignatureVerifier.recoverPublicKey(
          messageHash, r, s, recoveryId);

      if (publicKey != null) {
        return _publicKeyToEthereumAddress(publicKey);
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  /// Convert a 64-byte uncompressed public key to Ethereum address
  static String _publicKeyToEthereumAddress(Uint8List publicKey) {
    if (publicKey.length != 64) {
      throw ArgumentError('Public key must be 64 bytes');
    }

    // Keccak-256 hash of the public key
    final hash = sha3(publicKey);

    // Take the last 20 bytes as the address
    final addressBytes = hash.sublist(hash.length - 20);

    // Convert to hex string with 0x prefix
    return '0x${addressBytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join()}';
  }

  /// Keccak-256 hash function (Ethereum's hash function)
  ///
  /// Note: This is NOT the same as SHA-3-256. Keccak-256 uses different padding
  /// than the final SHA-3 standard. Ethereum uses the original Keccak submission.
  ///
  /// For production use, this should use a proper Keccak-256 implementation
  /// like the 'crypto' package with Keccak support or 'pointycastle'.
  static Uint8List sha3(Uint8List data) {
    // TODO: Replace with proper Keccak-256 implementation
    // For now, document the requirement clearly
    throw UnimplementedError('Keccak-256 hash function not implemented. '
        'This requires a proper Keccak-256 implementation, not SHA-256. '
        'Consider using packages like "pointycastle" or "keccak" that provide '
        'true Keccak-256 hashing as used by Ethereum.');
  }

  /// Gets a human-readable description of Ethereum validation rules
  static String getValidationRules() => '''
Ethereum Address Validation Rules:
• Must be a valid hexadecimal string
• Must be exactly 40 characters long (excluding 0x prefix)
• Can optionally include 0x prefix
• Mixed case addresses must pass EIP-55 checksum validation
• RoA validation requires valid ECDSA signature over standard message format

RoA Message Format:
"I authorize associating the Ethereum address {address} with the Solana domain {domain}.sol"
    ''';
}
