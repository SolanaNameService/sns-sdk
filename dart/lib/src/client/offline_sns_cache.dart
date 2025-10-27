import '../client/sns_client.dart';

/// Offline capability with sync for mobile environments
class OfflineSnsCache {
  // In production, this would use SQLite or Hive database
  static final Map<String, CachedDomain> _domainCache = {};
  static final Map<String, CachedRecord> _recordCache = {};
  static final Set<String> _dirtyDomains = {};

  /// Cache domain data locally
  Future<void> cacheDomain(CachedDomain domain) async {
    // In Flutter:
    // await _db.insert('domains', domain.toMap());

    _domainCache[domain.name] = domain;
  }

  /// Retrieve cached domain data
  Future<CachedDomain?> getCachedDomain(String domain) async =>
      _domainCache[domain];

  /// Cache record data
  Future<void> cacheRecord(
      String domain, String recordType, CachedRecord record) async {
    final key = '$domain:$recordType';
    _recordCache[key] = record;
  }

  /// Get cached record
  Future<CachedRecord?> getCachedRecord(
      String domain, String recordType) async {
    final key = '$domain:$recordType';
    return _recordCache[key];
  }

  /// Mark domain as dirty (needs sync)
  void markDirty(String domain) {
    _dirtyDomains.add(domain);
  }

  /// Sync cached data with network
  Future<SyncResult> syncWithNetwork(SnsClient client) async {
    var syncedCount = 0;
    var errorCount = 0;
    final errors = <String>[];

    // Sync dirty domains
    for (final domain in _dirtyDomains.toList()) {
      try {
        // In a real implementation, this would fetch fresh data
        // and update the local cache
        await _syncDomain(client, domain);
        _dirtyDomains.remove(domain);
        syncedCount++;
      } on Exception catch (e) {
        errorCount++;
        errors.add('Failed to sync $domain: $e');
      }
    }

    // Clean up expired entries
    await _cleanupExpiredEntries();

    return SyncResult(
      syncedDomains: syncedCount,
      errors: errorCount,
      errorMessages: errors,
    );
  }

  /// Sync a specific domain with network data
  Future<void> _syncDomain(SnsClient client, String domain) async {
    try {
      // Fetch fresh domain information from network
      final domainKey = await _getDomainKey(domain);
      final accountInfo = await client.getAccountInfo(domainKey);

      if (accountInfo.exists) {
        // Parse the registry data to extract owner and metadata
        final owner = await _parseOwnerFromAccountData(accountInfo.data);

        // Update the cache with fresh data
        final updatedDomain = CachedDomain(
          name: domain,
          owner: owner,
          lastUpdated: DateTime.now(),
          metadata: {
            'dataLength': accountInfo.data.length,
            'syncedAt': DateTime.now().toIso8601String(),
          },
        );

        _domainCache[domain] = updatedDomain;
      } else {
        // Domain doesn't exist on-chain, remove from cache
        _domainCache.remove(domain);
      }
    } catch (e) {
      // If sync fails, just update the timestamp to prevent repeated attempts
      final cached = _domainCache[domain];
      if (cached != null) {
        _domainCache[domain] = cached.copyWith(
          lastUpdated: DateTime.now(),
          metadata: {
            ...cached.metadata,
            'lastSyncError': e.toString(),
            'lastSyncAttempt': DateTime.now().toIso8601String(),
          },
        );
      }
    }
  }

  /// Get domain key for the given domain name
  Future<String> _getDomainKey(String domain) async {
    // This would use the same domain key derivation logic as the main SDK
    // For now, throw to indicate this needs to be implemented
    throw UnimplementedError(
      'Domain key derivation needed. Import getDomainKeySync from utils.',
    );
  }

  /// Parse owner address from account data
  Future<String?> _parseOwnerFromAccountData(List<int> data) async {
    try {
      // This would implement the same registry parsing logic as RegistryState
      // For now, return null to indicate parsing not implemented
      return null;
    } catch (e) {
      return null;
    }
  }

  /// Clean up expired cache entries
  Future<void> _cleanupExpiredEntries() async {
    final now = DateTime.now();
    final expiredDomains = <String>[];
    final expiredRecords = <String>[];

    // Find expired domains
    _domainCache.forEach((key, domain) {
      if (now.difference(domain.lastUpdated).inHours > 24) {
        expiredDomains.add(key);
      }
    });

    // Find expired records
    _recordCache.forEach((key, record) {
      if (now.difference(record.lastUpdated).inHours > 6) {
        expiredRecords.add(key);
      }
    });

    // Remove expired entries
    for (final key in expiredDomains) {
      _domainCache.remove(key);
    }
    for (final key in expiredRecords) {
      _recordCache.remove(key);
    }
  }

  /// Get cache statistics
  CacheStatistics getStatistics() {
    final now = DateTime.now();
    var freshDomains = 0;
    var staleDomains = 0;

    _domainCache.forEach((key, domain) {
      if (now.difference(domain.lastUpdated).inHours < 1) {
        freshDomains++;
      } else {
        staleDomains++;
      }
    });

    return CacheStatistics(
      totalDomains: _domainCache.length,
      freshDomains: freshDomains,
      staleDomains: staleDomains,
      totalRecords: _recordCache.length,
      dirtyDomains: _dirtyDomains.length,
    );
  }

  /// Clear all cached data
  Future<void> clearCache() async {
    _domainCache.clear();
    _recordCache.clear();
    _dirtyDomains.clear();
  }
}

/// Cached domain data
class CachedDomain {
  const CachedDomain({
    required this.name,
    required this.lastUpdated,
    this.owner,
    this.metadata = const {},
  });
  final String name;
  final String? owner;
  final DateTime lastUpdated;
  final Map<String, dynamic> metadata;

  CachedDomain copyWith({
    String? name,
    String? owner,
    DateTime? lastUpdated,
    Map<String, dynamic>? metadata,
  }) =>
      CachedDomain(
        name: name ?? this.name,
        owner: owner ?? this.owner,
        lastUpdated: lastUpdated ?? this.lastUpdated,
        metadata: metadata ?? this.metadata,
      );
}

/// Cached record data
class CachedRecord {
  const CachedRecord({
    required this.content,
    required this.lastUpdated,
    required this.verified,
  });
  final String content;
  final DateTime lastUpdated;
  final bool verified;
}

/// Sync operation result
class SyncResult {
  const SyncResult({
    required this.syncedDomains,
    required this.errors,
    required this.errorMessages,
  });
  final int syncedDomains;
  final int errors;
  final List<String> errorMessages;

  bool get isSuccess => errors == 0;
}

/// Cache statistics
class CacheStatistics {
  const CacheStatistics({
    required this.totalDomains,
    required this.freshDomains,
    required this.staleDomains,
    required this.totalRecords,
    required this.dirtyDomains,
  });
  final int totalDomains;
  final int freshDomains;
  final int staleDomains;
  final int totalRecords;
  final int dirtyDomains;

  @override
  String toString() =>
      'CacheStatistics(domains: $totalDomains, fresh: $freshDomains, '
      'stale: $staleDomains, records: $totalRecords, dirty: $dirtyDomains)';
}
