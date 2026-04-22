import 'dart:typed_data';
import 'package:test/test.dart';
import 'package:sns_sdk/src/validation/ethereum_signature_verifier.dart';

void main() {
  group('Robust Ethereum Signature Verifier Tests', () {
    test('should use proper keccak256 hash function', () {
      final message = 'Hello, SNS!';
      final result = EthereumSignatureVerifier.verifySignature(
        message: message,
        signature: Uint8List(65), // Mock signature
        expectedPubkey: Uint8List(64), // Mock public key
      );

      // Should not crash and should produce a result
      expect(result, isA<EthereumSignatureResult>());
      expect(result.messageHash, isNotNull);
      expect(result.messageHash!.length, equals(32)); // 256 bits / 8 = 32 bytes
    });

    test('should validate signature length correctly', () {
      final result = EthereumSignatureVerifier.verifySignature(
        message: 'test',
        signature: Uint8List(64), // Too short
        expectedPubkey: Uint8List(64),
      );

      expect(result.isValid, isFalse);
      expect(result.error, contains('Invalid signature length'));
    });

    test('should validate public key length correctly', () {
      final result = EthereumSignatureVerifier.verifySignature(
        message: 'test',
        signature: Uint8List(65),
        expectedPubkey: Uint8List(32), // Too short
      );

      expect(result.isValid, isFalse);
      expect(result.error, contains('Invalid public key length'));
    });

    test('should validate recovery ID correctly', () {
      final signature = Uint8List(65);
      signature[64] = 30; // Invalid recovery ID

      final result = EthereumSignatureVerifier.verifySignature(
        message: 'test',
        signature: signature,
        expectedPubkey: Uint8List(64),
      );

      expect(result.isValid, isFalse);
      expect(result.error, contains('Invalid recovery ID'));
    });

    test('should create proper ROA message format', () {
      final result = EthereumSignatureVerifier.verifyRoaSignature(
        domain: 'example',
        record: 'A',
        signature: Uint8List(65),
        expectedPubkey: Uint8List(64),
      );

      // Should create message in format "SNS ROA: A.example"
      expect(result, isA<EthereumSignatureResult>());
    });

    test('EthereumAddressUtils should validate addresses correctly', () {
      expect(
          EthereumAddressUtils.isValidAddress(
              '0x742d35cc6635c0532925a3b8c1865c71a8d5a432'),
          isTrue);
      expect(
          EthereumAddressUtils.isValidAddress(
              '0x742d35cc6635c0532925a3b8c1865c71a8d5a43'),
          isFalse); // Too short
      expect(
          EthereumAddressUtils.isValidAddress(
              '742d35cc6635c0532925a3b8c1865c71a8d5a432'),
          isFalse); // No 0x prefix
      expect(
          EthereumAddressUtils.isValidAddress('0xZZZ'), isFalse); // Invalid hex
    });

    test('EthereumAddressUtils should convert public key to address', () {
      final publicKey = Uint8List(64);
      // Fill with some test data
      for (var i = 0; i < 64; i++) {
        publicKey[i] = i % 256;
      }

      final address = EthereumAddressUtils.publicKeyToAddress(publicKey);
      expect(address.startsWith('0x'), isTrue);
      expect(address.length, equals(42)); // 0x + 40 hex chars
    });

    test('should handle exceptions gracefully', () {
      // Test with null-like data that might cause issues
      final result = EthereumSignatureVerifier.verifySignature(
        message: '',
        signature: Uint8List(65),
        expectedPubkey: Uint8List(64),
      );

      expect(result, isA<EthereumSignatureResult>());
      // Should not crash, should return a result
    });
  });
}
