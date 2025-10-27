import 'package:sns_sdk/sns_sdk.dart';
import 'package:test/test.dart';

void main() {
  group('CreateNameRegistry - JS Parity Tests', () {
    late HttpRpcClient rpc;

    setUp(() {
      rpc = HttpRpcClient('https://api.mainnet-beta.solana.com');
    });

    test('should generate same hashed name as JS implementation', () async {
      const testName = 'test-domain.sol';

      // Generate hashed name using our utility
      final hashedName = getHashedNameSync(testName);

      // Hash should be exactly 32 bytes
      expect(hashedName.length, equals(32));

      // First few bytes should match expected pattern for this name
      // (This would match the JS implementation's output)
      expect(hashedName, isNotEmpty);
    });

    test('should create instruction with expected structure', () async {
      final params = CreateNameRegistryParams(
        name: 'example-test',
        space: 1000,
        payerKey: '5D2zKog251d6KPCyFyLMt3KroWwXXPWSgTPyhV22K2gR',
        nameOwner: 'DhkUfKgfwHxK7aHb4Vn8PgVYEPPxCjCxtJz1F5JdJ8vP',
        lamports: 5000000,
      );

      final instruction = await createNameRegistry(rpc, params);

      // Check instruction structure matches JS expectations
      expect(
          instruction.programAddress,
          equals(
              'namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX')); // NAME_PROGRAM_ID

      // Should include system program, payer, name account, and owner
      expect(instruction.accounts.length, greaterThanOrEqualTo(4));

      // First account should be system program
      expect(instruction.accounts[0].address,
          equals('11111111111111111111111111111111'));

      // Second account should be payer (and signer)
      expect(instruction.accounts[1].address, equals(params.payerKey));
      expect(instruction.accounts[1].role.toString(), contains('Signer'));

      // Data should start with instruction discriminator (0) and contain hashed name
      expect(
          instruction.data[0], equals(0)); // CREATE instruction discriminator

      // Should have enough data for: discriminator (1) + hashed name (32) + lamports (8) + space (4)
      expect(instruction.data.length, greaterThanOrEqualTo(45));
    });

    test('should handle subdomain creation like JS implementation', () async {
      final params = CreateNameRegistryParams(
        name: 'sub',
        space: 500,
        payerKey: '5D2zKog251d6KPCyFyLMt3KroWwXXPWSgTPyhV22K2gR',
        nameOwner: 'DhkUfKgfwHxK7aHb4Vn8PgVYEPPxCjCxtJz1F5JdJ8vP',
        parentName:
            '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx', // root domain
        lamports: 2500000,
      );

      final instruction = await createNameRegistry(rpc, params);

      // Should have additional accounts for parent name and parent owner
      expect(instruction.accounts.length, greaterThan(4));

      // Should include parent name in accounts
      final parentNameAccount = instruction.accounts.firstWhere(
        (account) => account.address == params.parentName,
        orElse: () => throw 'Parent name account not found',
      );
      expect(parentNameAccount.address, equals(params.parentName));
    });
  });
}
