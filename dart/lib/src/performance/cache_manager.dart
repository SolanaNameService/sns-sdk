import 'dart:async';

import '../rpc/rpc_client.dart';

/// Cache entry for in-memory storage
class CacheEntry<T> {
  const CacheEntry(this.data, this.expiry);
  final T data;
  final DateTime expiry;

  bool get isExpired => DateTime.now().isAfter(expiry);
}

/// High-performance in-memory cache for frequently accessed SNS data
///
/// This provides caching for:
/// - Domain addresses and records
/// - Account data and states
/// - Derived addresses (PDAs)
/// - NFT information
class SnsCache {
  SnsCache._internal();
  static final SnsCache _instance = SnsCache._internal();
  static SnsCache get instance => _instance;

  final Map<String, CacheEntry<dynamic>> _cache = {};
  final Duration _defaultTtl = const Duration(minutes: 5);

  /// Get cached data if available and not expired
  T? get<T>(String key) {
    final entry = _cache[key];
    if (entry == null || entry.isExpired) {
      _cache.remove(key);
      return null;
    }
    return entry.data as T;
  }

  /// Store data in cache with TTL
  void set<T>(String key, T data, {Duration? ttl}) {
    final expiry = DateTime.now().add(ttl ?? _defaultTtl);
    _cache[key] = CacheEntry(data, expiry);
  }

  /// Remove specific key from cache
  void remove(String key) {
    _cache.remove(key);
  }

  /// Clear all cached data
  void clear() {
    _cache.clear();
  }

  /// Get cache statistics
  Map<String, int> get stats => {
        'total_entries': _cache.length,
        'expired_entries': _cache.values.where((e) => e.isExpired).length,
      };

  /// Clean up expired entries
  void cleanup() {
    final keysToRemove = <String>[];
    for (final entry in _cache.entries) {
      if (entry.value.isExpired) {
        keysToRemove.add(entry.key);
      }
    }
    for (final key in keysToRemove) {
      _cache.remove(key);
    }
  }
}

/// Batch RPC client for parallel operations
///
/// Optimizes network usage by batching multiple RPC calls and processing them
/// in parallel, similar to js-kit batch operations
class BatchRpcClient {
  BatchRpcClient(this._rpc, {int maxConcurrentRequests = 10})
      : _maxConcurrentRequests = maxConcurrentRequests;
  final RpcClient _rpc;
  final int _maxConcurrentRequests;

  /// Fetch multiple accounts in parallel with automatic batching
  Future<List<AccountInfo>> fetchMultipleAccounts(
    List<String> addresses, {
    bool useCache = true,
  }) async {
    final results = <AccountInfo>[];
    final cache = SnsCache.instance;
    final addressesToFetch = <String>[];

    // Check cache first if enabled
    if (useCache) {
      for (final address in addresses) {
        final cached = cache.get<AccountInfo>('account_$address');
        if (cached != null) {
          results.add(cached);
        } else {
          addressesToFetch.add(address);
        }
      }
    } else {
      addressesToFetch.addAll(addresses);
    }

    if (addressesToFetch.isEmpty) {
      return results;
    }

    // Process in batches to avoid overwhelming the RPC
    const batchSize = 100; // Solana RPC limit
    final batches = <List<String>>[];
    for (var i = 0; i < addressesToFetch.length; i += batchSize) {
      final end = (i + batchSize < addressesToFetch.length)
          ? i + batchSize
          : addressesToFetch.length;
      batches.add(addressesToFetch.sublist(i, end));
    }

    // Execute batches in parallel up to max concurrent requests
    final futures = batches.map(_rpc.fetchEncodedAccounts);
    final batchedResults = await _executeConcurrently(futures);

    // Flatten results and cache them
    for (final batchResult in batchedResults) {
      for (var i = 0; i < batchResult.length; i++) {
        final account = batchResult[i];
        results.add(account);

        if (useCache && account.exists) {
          final address = addressesToFetch[results.length - 1];
          cache.set('account_$address', account);
        }
      }
    }

    return results;
  }

  /// Execute futures with concurrency control
  Future<List<T>> _executeConcurrently<T>(Iterable<Future<T>> futures) async {
    final results = <T>[];
    final activeFutures = <Future<T>>[];
    final iterator = futures.iterator;

    // Fill initial batch
    while (
        activeFutures.length < _maxConcurrentRequests && iterator.moveNext()) {
      activeFutures.add(iterator.current);
    }

    // Process futures as they complete
    while (activeFutures.isNotEmpty) {
      final completed = await Future.any(activeFutures.map((f) async {
        final result = await f;
        return {'future': f, 'result': result};
      }));

      final future = completed['future'] as Future<T>;
      final result = completed['result'] as T;

      results.add(result);
      activeFutures.remove(future);

      // Add next future if available
      if (iterator.moveNext()) {
        activeFutures.add(iterator.current);
      }
    }

    return results;
  }

  /// Fetch multiple domain records in parallel
  Future<List<String?>> fetchDomainRecords(
    List<String> domains,
    String recordType, {
    bool useCache = true,
  }) async {
    final cache = SnsCache.instance;
    final results = <String?>[];

    // Create futures for all domain record fetches
    final futures = domains.map((domain) async {
      final cacheKey = 'record_${domain}_$recordType';

      if (useCache) {
        final cached = cache.get<String?>(cacheKey);
        if (cached != null) {
          return cached;
        }
      }

      try {
        // This would call the actual domain record fetching logic
        // For now, return null to indicate record not found
        const String? record = null;

        if (useCache && record != null) {
          cache.set(cacheKey, record);
        }

        return record;
      } on Exception {
        return null;
      }
    });

    results.addAll(await _executeConcurrently(futures));
    return results;
  }
}

/// Performance monitoring for SNS operations
class SnsPerformanceMonitor {
  static final Map<String, List<Duration>> _operationTimes = {};
  static final Map<String, int> _operationCounts = {};

  /// Record operation timing
  static void recordOperation(String operation, Duration duration) {
    _operationTimes.putIfAbsent(operation, () => []).add(duration);
    _operationCounts[operation] = (_operationCounts[operation] ?? 0) + 1;
  }

  /// Get performance statistics
  static Map<String, dynamic> getStats() {
    final stats = <String, dynamic>{};

    for (final operation in _operationTimes.keys) {
      final times = _operationTimes[operation]!;
      final count = _operationCounts[operation]!;

      if (times.isNotEmpty) {
        final totalMs = times.fold<int>(0, (sum, d) => sum + d.inMilliseconds);
        final avgMs = totalMs / times.length;
        final minMs =
            times.map((d) => d.inMilliseconds).reduce((a, b) => a < b ? a : b);
        final maxMs =
            times.map((d) => d.inMilliseconds).reduce((a, b) => a > b ? a : b);

        stats[operation] = {
          'count': count,
          'avg_ms': avgMs.round(),
          'min_ms': minMs,
          'max_ms': maxMs,
          'total_ms': totalMs,
        };
      }
    }

    return stats;
  }

  /// Clear performance data
  static void clear() {
    _operationTimes.clear();
    _operationCounts.clear();
  }

  /// Time an operation and record its performance
  static Future<T> timeOperation<T>(
    String operation,
    Future<T> Function() task,
  ) async {
    final stopwatch = Stopwatch()..start();
    try {
      final result = await task();
      return result;
    } finally {
      stopwatch.stop();
      recordOperation(operation, stopwatch.elapsed);
    }
  }
}
