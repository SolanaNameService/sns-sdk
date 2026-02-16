/// Favorite Domain test for SNS SDK
/// Mirrors js/tests/favorite.test.ts exactly
library;

import 'package:sns_sdk/sns_sdk.dart';
import 'package:solana/solana.dart' hide RpcClient;
import 'package:test/test.dart';
import 'test_constants.dart';

void main() {
  group('Favorite domain', () {
    late RpcClient connection;

    setUpAll(() {
      final rpcUrl = getRpcUrl();
      if (rpcUrl == null) {
        printSkipMessage('Favorite domain');
        return;
      }

      connection = EnhancedSolanaRpcClient(rpcUrl);
    });

    test('Favorite domain', () async {
      if (shouldSkipTests()) {
        return;
      }

      final testItems = [
        {
          'user': 'FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ',
          'favorite': {
            'domain': 'Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb',
            'reverse': 'bonfida',
            'stale': true,
          },
        },
        {
          'user': 'Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v',
          'favorite': {
            'domain': 'AgJujvNQgYESUwBPitq2VUrfTaT2bvueHbgvsxqZ2sHg',
            'reverse': 'couponvault',
            'stale': false,
          },
        },
      ];

      for (final item in testItems) {
        final user = Ed25519HDPublicKey.fromBase58(item['user'] as String);
        final expectedFavorite = item['favorite'] as Map<String, dynamic>;

        final fav = await getFavoriteDomain(connection, user);

        expect(fav.domain.toBase58(),
            equals(expectedFavorite['domain'] as String));
        expect(fav.reverse, equals(expectedFavorite['reverse'] as String));
        expect(fav.stale, equals(expectedFavorite['stale'] as bool));
      }
    }, timeout: const Timeout(Duration(seconds: 10)));

    test('Multiple favorite domains', () async {
      if (shouldSkipTests()) {
        return;
      }

      final testItems = [
        // Non tokenized
        {
          'wallet': 'Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v',
          'domain': 'couponvault',
        },
        // Stale non tokenized
        {
          'wallet': 'FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ',
          'domain': null,
        },
        // Tokenized
        {
          'wallet': '36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4',
          'domain': 'fav-tokenized',
        },
      ];

      final wallets = testItems
          .map(
              (item) => Ed25519HDPublicKey.fromBase58(item['wallet'] as String))
          .toList();

      final result = await getMultipleFavoriteDomains(connection, wallets);

      for (var i = 0; i < result.length; i++) {
        expect(result[i], equals(testItems[i]['domain']));
      }
    }, timeout: const Timeout(Duration(seconds: 10)));
  });
}
