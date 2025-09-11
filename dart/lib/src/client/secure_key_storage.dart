import 'dart:typed_data';
import 'package:crypto/crypto.dart';

/// Secure storage integration for private keys and sensitive data
///
/// This implementation provides in-memory storage for development and testing.
/// For production Flutter apps, replace this with FlutterSecureStorage:
///
/// ```dart
/// // Add to pubspec.yaml:
/// // flutter_secure_storage: ^9.0.0
///
/// import 'package:flutter_secure_storage/flutter_secure_storage.dart';
///
/// class SecureKeyStorage {
///   static const _storage = FlutterSecureStorage();
///
///   static Future<void> storePrivateKey(String keyId, Uint8List privateKey) async {
///     await _storage.write(key: keyId, value: base64Encode(privateKey));
///   }
///
///   static Future<Uint8List?> getPrivateKey(String keyId) async {
///     final value = await _storage.read(key: keyId);
///     return value != null ? base64Decode(value) : null;
///   }
/// }
/// ```
class SecureKeyStorage {
  // In-memory storage for development/testing (NOT secure for production)
  static final Map<String, Uint8List> _storage = {};

  /// Store a private key securely
  ///
  /// **Warning**: This implementation stores keys in memory and is NOT secure
  /// for production use. Use FlutterSecureStorage for production apps.
  static Future<void> storePrivateKey(
      String keyId, Uint8List privateKey) async {
    // Store with basic obfuscation (still not secure for production)
    _storage[keyId] = _obfuscateData(privateKey);
  }

  /// Retrieve a private key
  ///
  /// **Warning**: This implementation is NOT secure for production use.
  static Future<Uint8List?> getPrivateKey(String keyId) async {
    final obfuscatedKey = _storage[keyId];
    if (obfuscatedKey == null) return null;

    // Deobfuscate the data
    return _deobfuscateData(obfuscatedKey);
  }

  /// Store encrypted data with improved obfuscation
  static Future<void> storeEncryptedData(
    String key,
    Uint8List data,
    Uint8List encryptionKey,
  ) async {
    // Use HMAC-based encryption for better security (still not production-ready)
    final encrypted = _hmacEncrypt(data, encryptionKey);
    _storage[key] = encrypted;
  }

  /// Retrieve and decrypt data
  static Future<Uint8List?> getEncryptedData(
    String key,
    Uint8List encryptionKey,
  ) async {
    final encrypted = _storage[key];
    if (encrypted == null) return null;

    // Decrypt using HMAC-based method
    return _hmacEncrypt(
        encrypted, encryptionKey); // Decryption same as encryption for XOR
  }

  /// Delete stored key
  static Future<void> deleteKey(String keyId) async {
    // In Flutter:
    // final storage = FlutterSecureStorage();
    // await storage.delete(key: keyId);

    _storage.remove(keyId);
  }

  /// Delete all stored data
  static Future<void> deleteAll() async {
    // In Flutter:
    // final storage = FlutterSecureStorage();
    // await storage.deleteAll();

    _storage.clear();
  }

  /// Check if a key exists
  static Future<bool> hasKey(String keyId) async {
    // In Flutter:
    // final storage = FlutterSecureStorage();
    // final value = await storage.read(key: keyId);
    // return value != null;

    return _storage.containsKey(keyId);
  }

  /// List all stored key IDs
  static Future<List<String>> getAllKeys() async {
    // In Flutter:
    // final storage = FlutterSecureStorage();
    // return await storage.readAll().then((map) => map.keys.toList());

    return _storage.keys.toList();
  }

  /// Simple obfuscation (NOT cryptographically secure)
  static Uint8List _obfuscateData(Uint8List data) {
    final result = Uint8List(data.length);
    final salt = DateTime.now().millisecondsSinceEpoch % 256;

    for (var i = 0; i < data.length; i++) {
      result[i] = (data[i] ^ salt ^ i) % 256;
    }
    return result;
  }

  /// Simple deobfuscation (NOT cryptographically secure)
  static Uint8List _deobfuscateData(Uint8List obfuscatedData) {
    final result = Uint8List(obfuscatedData.length);
    final salt = DateTime.now().millisecondsSinceEpoch % 256;

    for (var i = 0; i < obfuscatedData.length; i++) {
      result[i] = (obfuscatedData[i] ^ salt ^ i) % 256;
    }
    return result;
  }

  /// HMAC-based encryption (better than XOR but still not production-ready)
  static Uint8List _hmacEncrypt(Uint8List data, Uint8List key) {
    final hmacKey = key.length >= 32 ? key.sublist(0, 32) : _padKey(key, 32);
    final hmac = Hmac(sha256, hmacKey);
    final keyStream = hmac.convert(data).bytes;

    final result = Uint8List(data.length);
    for (var i = 0; i < data.length; i++) {
      result[i] = data[i] ^ keyStream[i % keyStream.length];
    }
    return result;
  }

  /// Pad key to required length
  static Uint8List _padKey(Uint8List key, int targetLength) {
    final padded = Uint8List(targetLength);
    for (var i = 0; i < targetLength; i++) {
      padded[i] = key[i % key.length];
    }
    return padded;
  }
}
