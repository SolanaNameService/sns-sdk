import 'package:sns_sdk/sns_sdk.dart';
import 'package:test/test.dart';

void main() {
  group('CreateNameRegistry', () {
    late HttpRpcClient rpc;

    setUp(() {
      rpc = HttpRpcClient('https://api.mainnet-beta.solana.com');
    });

    test('should create instruction with valid parameters', () async {
      final params = CreateNameRegistryParams(
        name: 'test-domain',
        space: 1000,
        payerKey: 'DhkUfKgfwHxK7aHb4Vn8PgVYEPPxCjCxtJz1F5JdJ8vP',
        nameOwner: 'HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA',
        lamports: 5000000,
      );

      final instruction = await createNameRegistry(rpc, params);

      expect(instruction, isNotNull);
      expect(instruction.programAddress, isNotEmpty);
      expect(instruction.accounts.length, greaterThan(2));
      expect(
          instruction.data.length,
          greaterThan(
              40)); // Should have at least hashed name + lamports + space
    });

    test('should handle parent name parameter', () async {
      final params = CreateNameRegistryParams(
        name: 'sub-domain',
        space: 500,
        payerKey: 'DhkUfKgfwHxK7aHb4Vn8PgVYEPPxCjCxtJz1F5JdJ8vP',
        nameOwner: 'HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA',
        parentName:
            '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx', // root domain
      );

      final instruction = await createNameRegistry(rpc, params);

      expect(instruction, isNotNull);
      expect(instruction.accounts.length,
          greaterThan(4)); // Should have more accounts with parent
    });

    test('should calculate lamports when not provided', () async {
      final params = CreateNameRegistryParams(
        name: 'auto-lamports',
        space: 1000,
        payerKey: 'DhkUfKgfwHxK7aHb4Vn8PgVYEPPxCjCxtJz1F5JdJ8vP',
        nameOwner: 'HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA',
        // No lamports provided - should be calculated
      );

      final instruction = await createNameRegistry(rpc, params);

      expect(instruction, isNotNull);
      // Should still create valid instruction even without explicit lamports
      expect(instruction.data.length, greaterThan(40));
    });
  });
}
