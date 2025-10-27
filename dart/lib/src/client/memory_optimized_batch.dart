/// Memory management for mobile constraints
class MemoryOptimizedBatch<T> {
  MemoryOptimizedBatch({int batchSize = 100}) : _batchSize = batchSize;
  final int _batchSize;

  /// Process items in batches to manage memory
  Stream<List<T>> process<R>(
    List<R> items,
    Future<T> Function(R) processor,
  ) async* {
    for (var i = 0; i < items.length; i += _batchSize) {
      final endIndex = (i + _batchSize).clamp(0, items.length);
      final batch = items.sublist(i, endIndex);

      final results = <T>[];
      for (final item in batch) {
        try {
          final result = await processor(item);
          results.add(result);
        } on Exception {
          // Skip failed items, could also collect errors if needed
          continue;
        }
      }

      yield results;

      // Give the UI thread a chance to update
      await Future.delayed(const Duration(milliseconds: 1));
    }
  }

  /// Process items in parallel batches with concurrency control
  Stream<List<T>> processParallel<R>(
    List<R> items,
    Future<T> Function(R) processor, {
    int concurrency = 5,
  }) async* {
    for (var i = 0; i < items.length; i += _batchSize) {
      final endIndex = (i + _batchSize).clamp(0, items.length);
      final batch = items.sublist(i, endIndex);

      // Split batch into concurrent groups
      final groups = <List<R>>[];
      for (var j = 0; j < batch.length; j += concurrency) {
        final groupEnd = (j + concurrency).clamp(0, batch.length);
        groups.add(batch.sublist(j, groupEnd));
      }

      final results = <T>[];
      for (final group in groups) {
        final futures = group.map(processor);
        final groupResults = await Future.wait(
          futures,
        );

        // Filter out null results from failures
        results.addAll(groupResults.where((r) => r != null));
      }

      yield results;

      // Give the UI thread a chance to update
      await Future.delayed(const Duration(milliseconds: 1));
    }
  }

  /// Estimate memory usage for a batch operation
  int estimateMemoryUsage({
    required int itemCount,
    required int averageItemSize,
    required int averageResultSize,
  }) {
    final peakItemMemory = _batchSize * averageItemSize;
    final peakResultMemory = _batchSize * averageResultSize;

    return peakItemMemory + peakResultMemory;
  }
}
