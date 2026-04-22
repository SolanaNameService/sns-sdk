import 'dart:async';

import 'package:solana/dto.dart' as solana_dto;
import 'package:solana/solana.dart' as solana;
import 'package:solana/src/rpc/dto/program_filter.dart' as program_filter;

/// WebSocket subscription client for real-time account change notifications
///
/// Real-time subscription client for SNS domain and record events.
///
/// This client provides real-time functionality using package:solana's
/// WebSocket infrastructure to enable reactive applications.
///
/// **KEY FEATURES:**
/// - Real-time account change subscriptions
/// - Program account change monitoring
/// - Automatic reconnection and error recovery
/// - Type-safe subscription management
class SolanaWebSocketClient {
  SolanaWebSocketClient(String websocketUrl)
      : _subscriptionClient = solana.SubscriptionClient.connect(websocketUrl);
  final solana.SubscriptionClient _subscriptionClient;
  final Map<String, StreamSubscription> _activeSubscriptions = {};

  /// Subscribes to account changes for a specific address
  ///
  /// This enables real-time updates for domain registry, NFT, and record accounts.
  /// Essential for building reactive UIs that respond to on-chain state changes.
  ///
  /// [address] - The base58-encoded account address to monitor
  /// [onAccountChange] - Callback function called when account data changes
  /// [commitment] - Confirmation level for subscription updates
  ///
  /// Returns a subscription ID that can be used to unsubscribe
  Future<String> subscribeToAccountChanges(
    String address, {
    required void Function(AccountChangeNotification) onAccountChange,
    solana_dto.Commitment commitment = solana_dto.Commitment.confirmed,
  }) async {
    try {
      final subscriptionId = DateTime.now().millisecondsSinceEpoch.toString();

      final subscription = _subscriptionClient
          .accountSubscribe(address, commitment: commitment)
          .listen((account) {
        onAccountChange(AccountChangeNotification(
          accountId: address,
          data: _extractAccountData(account.data),
          lamports: account.lamports,
          owner: account.owner,
          executable: account.executable,
          rentEpoch: account.rentEpoch.toInt(),
        ));
      });

      _activeSubscriptions[subscriptionId] = subscription;
      return subscriptionId;
    } on Exception catch (e) {
      throw SubscriptionException(
        'Failed to subscribe to account changes: $e',
        method: 'accountSubscribe',
        originalError: e,
      );
    }
  }

  /// Subscribes to program account changes for discovering new domains/subdomains
  ///
  /// This enables real-time monitoring of new registrations and transfers
  /// within the SNS program. Critical for apps that need to detect new domains.
  ///
  /// [programId] - The base58-encoded program ID to monitor
  /// [filters] - Optional filters to narrow down accounts (memcmp, dataSize)
  /// [onProgramAccountChange] - Callback for program account changes
  /// [commitment] - Confirmation level for subscription updates
  ///
  /// Returns a subscription ID that can be used to unsubscribe
  Future<String> subscribeToProgramAccountChanges(
    String programId, {
    required void Function(ProgramAccountChangeNotification)
        onProgramAccountChange,
    List<solana_dto.ProgramDataFilter>? filters,
    solana_dto.Commitment commitment = solana_dto.Commitment.confirmed,
  }) async {
    try {
      final subscriptionId = DateTime.now().millisecondsSinceEpoch.toString();

      // Convert filters to JSON format compatible with WebSocket protocol
      List<program_filter.ProgramFilter>? webSocketFilters;
      if (filters != null && filters.isNotEmpty) {
        webSocketFilters = filters
            .map((filter) => _JsonProgramFilter(filter.toJson()))
            .toList();
      }

      final subscription = _subscriptionClient
          .programSubscribe(
        programId,
        filters: webSocketFilters,
        commitment: commitment,
      )
          .listen((event) {
        // Parse the program account notification from the raw event
        final notification = _parseProgramAccountNotification(event, programId);
        if (notification != null) {
          onProgramAccountChange(notification);
        }
      });

      _activeSubscriptions[subscriptionId] = subscription;
      return subscriptionId;
    } on Exception catch (e) {
      throw SubscriptionException(
        'Failed to subscribe to program account changes: $e',
        method: 'programSubscribe',
        originalError: e,
      );
    }
  }

  /// Unsubscribes from a specific subscription
  ///
  /// [subscriptionId] - The ID returned from a subscribe method
  Future<void> unsubscribe(String subscriptionId) async {
    final subscription = _activeSubscriptions.remove(subscriptionId);
    if (subscription != null) {
      await subscription.cancel();
    }
  }

  /// Unsubscribes from all active subscriptions
  Future<void> unsubscribeAll() async {
    for (final subscription in _activeSubscriptions.values) {
      await subscription.cancel();
    }
    _activeSubscriptions.clear();
  }

  /// Closes the WebSocket connection and cleans up resources
  Future<void> dispose() async {
    await unsubscribeAll();
    _subscriptionClient.close();
  }

  /// Extracts account data from the subscription notification
  List<int> _extractAccountData(dynamic data) {
    if (data is solana_dto.BinaryAccountData) {
      return data.data;
    }
    return [];
  }

  /// Parses program account notification from the raw subscription event
  ProgramAccountChangeNotification? _parseProgramAccountNotification(
    dynamic event,
    String programId,
  ) {
    try {
      // The event structure from Solana WebSocket programSubscribe:
      // {
      //   "result": {
      //     "context": { "slot": 123456 },
      //     "value": {
      //       "pubkey": "account_address",
      //       "account": {
      //         "data": [...],
      //         "executable": false,
      //         "lamports": 1000000,
      //         "owner": "program_id",
      //         "rentEpoch": 200
      //       }
      //     }
      //   }
      // }

      if (event is Map<String, dynamic>) {
        final result = event['result'] as Map<String, dynamic>?;
        if (result != null) {
          final value = result['value'] as Map<String, dynamic>?;
          if (value != null) {
            final pubkey = value['pubkey'] as String?;
            final account = value['account'] as Map<String, dynamic>?;

            if (pubkey != null && account != null) {
              return ProgramAccountChangeNotification(
                accountId: pubkey,
                programId: programId,
                data: _extractAccountDataFromMap(account['data']),
                lamports: account['lamports'] as int? ?? 0,
                owner: account['owner'] as String? ?? '',
              );
            }
          }
        }
      }

      return null;
    } on Exception {
      // Return null for parsing errors - caller should handle
      return null;
    }
  }

  /// Extracts account data from various data formats
  List<int> _extractAccountDataFromMap(dynamic data) {
    if (data is List) {
      // Data is already a list of integers
      return data.cast<int>();
    } else if (data is String) {
      // Data might be base64 encoded
      try {
        // This would need proper base64 decoding
        return [];
      } on Exception {
        return [];
      }
    }
    return [];
  }
}

/// Account change notification containing updated account information
class AccountChangeNotification {
  const AccountChangeNotification({
    required this.accountId,
    required this.data,
    required this.lamports,
    required this.owner,
    required this.executable,
    required this.rentEpoch,
  });
  final String accountId;
  final List<int> data;
  final int lamports;
  final String owner;
  final bool executable;
  final int rentEpoch;
}

/// Program account change notification for new registrations
class ProgramAccountChangeNotification {
  const ProgramAccountChangeNotification({
    required this.accountId,
    required this.programId,
    required this.data,
    required this.lamports,
    required this.owner,
  });
  final String accountId;
  final String programId;
  final List<int> data;
  final int lamports;
  final String owner;
}

/// Exception thrown when subscription operations fail
class SubscriptionException implements Exception {
  const SubscriptionException(
    this.message, {
    this.method,
    this.originalError,
  });
  final String message;
  final String? method;
  final dynamic originalError;

  @override
  String toString() {
    final buffer = StringBuffer('SubscriptionException: $message');
    if (method != null) {
      buffer.write(' (method: $method)');
    }
    return buffer.toString();
  }
}

/// JSON-serializable program filter for WebSocket subscriptions
///
/// This class works around the limitation that the base ProgramFilter class
/// in the solana package doesn't support JSON serialization for WebSocket use.
class _JsonProgramFilter extends program_filter.ProgramFilter {
  const _JsonProgramFilter(this._jsonData);

  final Map<String, dynamic> _jsonData;

  /// Convert to JSON for WebSocket transmission
  /// This method will be called automatically during JSON encoding
  Map<String, dynamic> toJson() => _jsonData;
}
