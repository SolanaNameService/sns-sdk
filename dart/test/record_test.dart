/// Record operation tests for SNS SDK
///
/// Tests record retrieval and verification operations
/// based on js-kit/tests/record.test.ts
library;

import 'package:sns_sdk/src/constants/records.dart';
import 'package:sns_sdk/src/domain/get_domain_record.dart';
import 'package:sns_sdk/src/record/get_record_v2_address.dart';
import 'package:sns_sdk/src/record/verify_record_staleness.dart';
import 'package:sns_sdk/src/states/record.dart';
import 'package:test/test.dart';

import 'real_rpc_client.dart';
import 'test_constants.dart';

void main() {
  // Skip tests if RPC_URL is not available
  final rpcUrl = getRpcUrl();
  if (rpcUrl == null) {
    // print('Skipping record tests: RPC_URL environment variable not set');
    return;
  }

  // Create a real RPC client like the JS SDK does
  final rpc = createRealRpcClient();

  group('Record methods', () {
    group('getDomainRecord', () {
      test('should get SOL record for domain', () async {
        final result = await getDomainRecord(GetDomainRecordParams(
          rpc: rpc,
          domain: 'bonfida',
          record: Record.sol,
        ));

        expect(result, isA<DomainRecordResult>());
        expect(result.record, equals(Record.sol));
        expect(result.retrievedRecord, isA<RecordState>());
      });

      test('should get ETH record for domain', () async {
        final result = await getDomainRecord(GetDomainRecordParams(
          rpc: rpc,
          domain: 'bonfida',
          record: Record.eth,
        ));

        expect(result, isA<DomainRecordResult>());
        expect(result.record, equals(Record.eth));
        expect(result.retrievedRecord, isA<RecordState>());
      });

      test('should get URL record for domain', () async {
        final result = await getDomainRecord(GetDomainRecordParams(
          rpc: rpc,
          domain: 'bonfida',
          record: Record.url,
        ));

        expect(result, isA<DomainRecordResult>());
        expect(result.record, equals(Record.url));
        expect(result.retrievedRecord, isA<RecordState>());
      });

      test('should get various record types', () async {
        final recordTypes = [
          Record.sol,
          Record.eth,
          Record.btc,
          Record.url,
          Record.discord,
          Record.github,
          Record.reddit,
          Record.twitter,
          Record.telegram,
        ];

        for (final recordType in recordTypes) {
          final result = await getDomainRecord(GetDomainRecordParams(
            rpc: rpc,
            domain: 'bonfida',
            record: recordType,
          ));

          expect(result, isA<DomainRecordResult>());
          expect(result.record, equals(recordType));
          expect(result.retrievedRecord, isA<RecordState>());
        }
      });

      test('should handle different domains', () async {
        final domains = ['bonfida', 'sns-ip-5-wallet-1'];

        for (final domain in domains) {
          final result = await getDomainRecord(GetDomainRecordParams(
            rpc: rpc,
            domain: domain,
            record: Record.sol,
          ));

          expect(result, isA<DomainRecordResult>());
          expect(result.record, equals(Record.sol));
          expect(result.retrievedRecord, isA<RecordState>());
        }
      });

      test('should verify record verification status', () async {
        final result = await getDomainRecord(GetDomainRecordParams(
          rpc: rpc,
          domain: 'bonfida',
          record: Record.sol,
        ));

        expect(result.verified, isA<RecordVerification>());
      });
    });

    group('getRecordV2Address', () {
      test('should get record v2 address', () async {
        final result = await getRecordV2Address(const GetRecordV2AddressParams(
          domain: 'bonfida',
          record: Record.sol,
        ));

        expect(result, isNotEmpty);
      });
    });

    group('verifyRecordStaleness', () {
      test('should verify record staleness for a record address', () async {
        // First get a record address using getRecordV2Address
        final recordAddress =
            await getRecordV2Address(const GetRecordV2AddressParams(
          domain: 'bonfida',
          record: Record.sol,
        ));

        final result = await verifyRecordStaleness(VerifyRecordStalenessParams(
          rpc: rpc,
          recordAddress: recordAddress,
        ));

        expect(result, isA<bool>());
      });
    });

    group('error cases', () {
      test('should handle non-existent record', () async {
        expect(
          () => getDomainRecord(GetDomainRecordParams(
            rpc: rpc,
            domain:
                'non-existent-domain-${DateTime.now().millisecondsSinceEpoch}',
            record: Record.sol,
          )),
          throwsA(anything),
        );
      });

      // Note: we can't test invalid record type as Record is an enum in Dart
      // and can't be instantiated with invalid values
    });

    group('Error handling', () {
      test('should throw error for invalid domain', () async {
        expect(
          () => getDomainRecord(GetDomainRecordParams(
            rpc: rpc,
            domain: '',
            record: Record.sol,
          )),
          throwsA(anything),
        );
      });
    });
  });
}
