import 'dart:typed_data';
import 'package:test/test.dart';
import '../../lib/src/record/deserialize_record.dart';
import '../../lib/src/constants/records.dart';
import '../../lib/src/states/registry.dart';
import '../../lib/src/errors/sns_errors.dart';

void main() {
  group('Robust Record Deserialization Tests', () {
    group('Punycode Utilities', () {
      test('should decode punycode domains correctly', () {
        // Test cases from RFC 3492
        expect(PunycodeUtils.decode('maana-pta'), equals('mañana'));
        expect(PunycodeUtils.decode('--dqo34k'), equals('☃-⌘'));
        expect(PunycodeUtils.decode('xn--maana-pta'), equals('mañana'));
        expect(PunycodeUtils.decode('xn----dqo34k'), equals('☃-⌘'));
      });

      test('should handle invalid punycode gracefully', () {
        expect(PunycodeUtils.decode('invalid!@#'),
            equals('invalid!@#')); // Returns original for non-punycode
        expect(PunycodeUtils.decode(''), equals(''));
      });

      test('should handle ASCII-only strings', () {
        expect(PunycodeUtils.decode('hello'), equals('hello'));
        expect(PunycodeUtils.decode('example.com'), equals('example.com'));
      });
    });

    group('Base58 Utilities', () {
      test('should encode and decode correctly', () {
        final testData = [1, 2, 3, 4, 5];
        final encoded = Base58Utils.encode(testData);
        final decoded = Base58Utils.decode(encoded);
        expect(decoded, equals(testData));
      });

      test('should handle empty input', () {
        expect(Base58Utils.encode([]), equals(''));
        expect(Base58Utils.decode(''), equals([]));
      });

      test('should handle leading zeros', () {
        final testData = [0, 0, 1, 2, 3];
        final encoded = Base58Utils.encode(testData);
        expect(encoded.startsWith('11'), isTrue);
        final decoded = Base58Utils.decode(encoded);
        expect(decoded, equals(testData));
      });

      test('should handle invalid base58 characters', () {
        expect(() => Base58Utils.decode('0OIl'), throwsArgumentError);
      });
    });

    group('Bech32 Utilities', () {
      test('should encode and decode correctly', () {
        final testData = [1, 2, 3, 4, 5];
        final encoded = Bech32Utils.encode('test', testData);
        final decoded = Bech32Utils.decode(encoded);
        expect(decoded['hrp'], equals('test'));
        expect(decoded['data'], equals(testData));
      });

      test('should convert bits correctly', () {
        final testData = [0xFF, 0x00, 0xAA];
        final converted = Bech32Utils.convertBits(testData, 8, 5, true);
        expect(converted.length, greaterThan(0));

        final backConverted = Bech32Utils.convertBits(converted, 5, 8, false);
        // Should match original after removing padding
        expect(backConverted.take(testData.length).toList(), equals(testData));
      });

      test('should handle invalid bech32 strings', () {
        expect(() => Bech32Utils.decode('invalid'), throwsArgumentError);
        expect(() => Bech32Utils.decode('test1234567'), throwsArgumentError);
      });
    });

    group('IP Address Utilities', () {
      test('should validate IPv4 addresses correctly', () {
        expect(IpUtils.isValidIPv4('192.168.1.1'), isTrue);
        expect(IpUtils.isValidIPv4('127.0.0.1'), isTrue);
        expect(IpUtils.isValidIPv4('0.0.0.0'), isTrue);
        expect(IpUtils.isValidIPv4('255.255.255.255'), isTrue);

        expect(IpUtils.isValidIPv4('256.1.1.1'), isFalse);
        expect(IpUtils.isValidIPv4('192.168.1'), isFalse);
        expect(IpUtils.isValidIPv4('not.an.ip.address'), isFalse);
      });

      test('should validate IPv6 addresses correctly', () {
        expect(IpUtils.isValidIPv6('2001:db8::1'), isTrue);
        expect(IpUtils.isValidIPv6('::1'), isTrue);
        expect(IpUtils.isValidIPv6('fe80::1'), isTrue);
        expect(IpUtils.isValidIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334'),
            isTrue);

        expect(IpUtils.isValidIPv6('192.168.1.1'), isFalse);
        expect(
            IpUtils.isValidIPv6(
                'not:an:ipv6:address:with:too:many:colons:here'),
            isFalse);
      });

      test('should convert bytes to IPv4 correctly', () {
        final bytes = Uint8List.fromList([192, 168, 1, 1]);
        expect(IpUtils.bytesToIPv4(bytes), equals('192.168.1.1'));
      });

      test('should convert bytes to IPv6 correctly', () {
        final bytes = Uint8List.fromList([
          0x20,
          0x01,
          0x0d,
          0xb8,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x01
        ]);
        final result = IpUtils.bytesToIPv6(bytes);
        expect(result, equals('2001:db8::1'));
      });
    });

    group('Ethereum Address Utilities', () {
      test('should validate Ethereum addresses correctly', () {
        expect(
            EthereumUtils.isValidAddress(
                '0x1234567890123456789012345678901234567890'),
            isTrue);
        expect(
            EthereumUtils.isValidAddress(
                '0xabcdefabcdef1234567890123456789012345678'),
            isTrue);

        expect(
            EthereumUtils.isValidAddress(
                '1234567890123456789012345678901234567890'),
            isFalse);
        expect(
            EthereumUtils.isValidAddress(
                '0x123456789012345678901234567890123456789'),
            isFalse);
        expect(
            EthereumUtils.isValidAddress(
                '0x1234567890123456789012345678901234567890'),
            isTrue);
        expect(
            EthereumUtils.isValidAddress(
                '0xGHIJKL1234567890123456789012345678901234'),
            isFalse);
      });
    });

    group('Injective Address Utilities', () {
      test('should validate Injective addresses correctly', () {
        // This is a simplified test - in reality, we'd need valid bech32 injective addresses
        expect(
            InjectiveUtils.isValidAddress(
                'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49'),
            isFalse); // Invalid checksum
        expect(InjectiveUtils.isValidAddress('btc1234567890'), isFalse);
        expect(InjectiveUtils.isValidAddress('inj123'), isFalse);
      });
    });

    group('Record Deserialization Integration', () {
      test('should deserialize CNAME records with punycode', () {
        final punycodeData = 'xn--maana-pta.com';
        final buffer = Uint8List.fromList(punycodeData.codeUnits);
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: buffer,
        );

        final result = deserializeRecord(registry, Record.cname, 'test-key');
        expect(result, equals('mañana.com'));
      });

      test('should deserialize SOL records with base58', () {
        // Create 32-byte test data for SOL address
        final solData = Uint8List(32);
        for (int i = 0; i < 32; i++) {
          solData[i] = i + 1;
        }

        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: solData,
        );

        final result = deserializeRecord(registry, Record.sol, 'test-key');
        expect(result, isNotNull);
        expect(result!.length, greaterThan(0));

        // Verify it's valid base58
        final decoded = Base58Utils.decode(result);
        expect(decoded.length, equals(32));
      });

      test('should deserialize IPv4 A records', () {
        final ipData = Uint8List.fromList([192, 168, 1, 1]);
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: ipData,
        );

        final result = deserializeRecord(registry, Record.a, 'test-key');
        expect(result, equals('192.168.1.1'));
      });

      test('should deserialize IPv6 AAAA records', () {
        final ipv6Data = Uint8List.fromList([
          0x20,
          0x01,
          0x0d,
          0xb8,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x01
        ]);
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: ipv6Data,
        );

        final result = deserializeRecord(registry, Record.aaaa, 'test-key');
        expect(result, equals('2001:db8::1'));
      });

      test('should deserialize Ethereum addresses', () {
        final ethData = Uint8List.fromList([
          0x12,
          0x34,
          0x56,
          0x78,
          0x90,
          0x12,
          0x34,
          0x56,
          0x78,
          0x90,
          0x12,
          0x34,
          0x56,
          0x78,
          0x90,
          0x12,
          0x34,
          0x56,
          0x78,
          0x90
        ]);
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: ethData,
        );

        final result = deserializeRecord(registry, Record.eth, 'test-key');
        expect(result, equals('0x1234567890123456789012345678901234567890'));
      });

      test('should deserialize Injective addresses with bech32', () {
        final injData = Uint8List(20);
        for (int i = 0; i < 20; i++) {
          injData[i] = i + 1;
        }

        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: injData,
        );

        final result =
            deserializeRecord(registry, Record.injective, 'test-key');
        expect(result, isNotNull);
        expect(result!.startsWith('inj'), isTrue);
      });

      test('should handle empty or null registry data', () {
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: Uint8List(0),
        );

        final result = deserializeRecord(registry, Record.sol, 'test-key');
        expect(result, isNull);

        final result2 = deserializeRecord(null, Record.sol, 'test-key');
        expect(result2, isNull);
      });

      test('should handle all-zero buffers', () {
        final zeroData = Uint8List(32); // All zeros
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: zeroData,
        );

        final result = deserializeRecord(registry, Record.sol, 'test-key');
        expect(result, isNull);
      });
    });

    group('Error Handling', () {
      test('should throw InvalidRecordDataError for malformed SOL data', () {
        final shortData = Uint8List(16); // Too short for SOL
        // Fill with non-zero data so it does not get filtered out as empty
        for (int i = 0; i < shortData.length; i++) {
          shortData[i] = i + 1;
        }
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: shortData,
        );

        expect(
          () => deserializeRecord(registry, Record.sol, 'test-key'),
          throwsA(isA<InvalidRecordDataError>()),
        );
      });

      test('should throw InvalidRecordDataError for malformed address data',
          () {
        final invalidData = Uint8List.fromList('invalid-address'.codeUnits);
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: invalidData,
        );

        expect(
          () => deserializeRecord(registry, Record.sol, 'test-key'),
          throwsA(isA<InvalidRecordDataError>()),
        );
      });

      test('should deserialize IPv4 A records', () {
        final ipData = Uint8List.fromList([192, 168, 1, 1]);
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: ipData,
        );

        final result = deserializeRecord(registry, Record.a, 'test-key');
        expect(result, equals('192.168.1.1'));
      });

      test('should deserialize IPv6 AAAA records', () {
        final ipv6Data = Uint8List.fromList([
          0x20,
          0x01,
          0x0d,
          0xb8,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x01
        ]);
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: ipv6Data,
        );

        final result = deserializeRecord(registry, Record.aaaa, 'test-key');
        expect(result, equals('2001:db8::1'));
      });

      test('should deserialize Ethereum addresses', () {
        final ethData = Uint8List.fromList([
          0x12,
          0x34,
          0x56,
          0x78,
          0x90,
          0x12,
          0x34,
          0x56,
          0x78,
          0x90,
          0x12,
          0x34,
          0x56,
          0x78,
          0x90,
          0x12,
          0x34,
          0x56,
          0x78,
          0x90
        ]);
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: ethData,
        );

        final result = deserializeRecord(registry, Record.eth, 'test-key');
        expect(result, equals('0x1234567890123456789012345678901234567890'));
      });

      test('should deserialize Injective addresses with bech32', () {
        final injData = Uint8List(20);
        for (int i = 0; i < 20; i++) {
          injData[i] = i + 1;
        }

        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: injData,
        );

        final result =
            deserializeRecord(registry, Record.injective, 'test-key');
        expect(result, isNotNull);
        expect(result!.startsWith('inj'), isTrue);
      });

      test('should handle empty or null registry data', () {
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: Uint8List(0),
        );

        final result = deserializeRecord(registry, Record.sol, 'test-key');
        expect(result, isNull);

        final result2 = deserializeRecord(null, Record.sol, 'test-key');
        expect(result2, isNull);
      });

      test('should handle all-zero buffers', () {
        final zeroData = Uint8List(32); // All zeros
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: zeroData,
        );

        final result = deserializeRecord(registry, Record.sol, 'test-key');
        expect(result, isNull);
      });
    });

    group('Error Handling', () {
      test('should throw InvalidRecordDataError for malformed SOL data', () {
        final shortData = Uint8List(16); // Too short for SOL
        // Fill with non-zero data so it does not get filtered out as empty
        for (int i = 0; i < shortData.length; i++) {
          shortData[i] = i + 1;
        }
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: shortData,
        );

        expect(
          () => deserializeRecord(registry, Record.sol, 'test-key'),
          throwsA(isA<InvalidRecordDataError>()),
        );
      });

      test('should throw InvalidRecordDataError for malformed address data',
          () {
        final invalidData = Uint8List.fromList('invalid-address'.codeUnits);
        final registry = RegistryState(
          classAddress: 'test-class',
          parentName: '',
          owner: '',
          data: invalidData,
        );

        expect(
          () => deserializeRecord(registry, Record.eth, 'test-key'),
          throwsA(isA<InvalidRecordDataError>()),
        );
      });
    });
  });
}
