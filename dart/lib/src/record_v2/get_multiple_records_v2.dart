/// Get multiple Record V2 accounts for a domain
///
/// This module provides functionality to retrieve multiple Record V2 accounts
/// for a single domain, following the exact implementation pattern of the JavaScript SDK.
library;

import 'dart:async';
import 'dart:typed_data';

import '../constants/records.dart';
import '../rpc/rpc_client.dart';
import 'deserialize_record_v2_content.dart';
import 'get_record_v2_key.dart';

/// Result for a single record retrieval in batch operation
class RecordRetrievalResult {
  const RecordRetrievalResult({
    required this.record,
    this.retrievedRecord,
    this.error,
  });

  /// The record type that was requested
  final Record record;

  /// The retrieved content, null if record doesn't exist
  final String? retrievedRecord;

  /// Error message if retrieval failed
  final String? error;

  /// Whether the record was successfully retrieved
  bool get isSuccess => retrievedRecord != null && error == null;
}

/// Retrieves multiple Record V2 accounts for a domain
///
/// This function fetches multiple Record V2 accounts in batch and deserializes
/// their content, matching the JavaScript SDK implementation exactly.
///
/// Examples:
/// ```dart
/// final results = await getMultipleRecordsV2(
///   client,
///   'example.sol',
///   [Record.eth, Record.sol, Record.url]
/// );
///
/// for (final result in results) {
///   if (result.isSuccess) {
///     print('${result.record.name}: ${result.retrievedRecord}');
///   } else {
///     print('${result.record.name}: ${result.error}');
///   }
/// }
/// ```
///
/// @param connection The RPC client for blockchain interaction
/// @param domain The domain name to retrieve records for
/// @param records List of record types to retrieve
/// @param deserialize Whether to deserialize the content (defaults to true)
/// @returns List of RecordRetrievalResult objects for each requested record
Future<List<RecordRetrievalResult>> getMultipleRecordsV2(
  RpcClient connection,
  String domain,
  List<Record> records, {
  bool deserialize = true,
}) async {
  try {
    // Generate all record keys for the requested records
    final recordKeys = <String>[];
    for (final record in records) {
      final key = await getRecordV2Key(domain, record);
      recordKeys.add(key);
    }

    // Fetch all accounts in batch
    final accountInfos = await connection.fetchEncodedAccounts(recordKeys);

    // Process each account and build results
    final results = <RecordRetrievalResult>[];

    for (var i = 0; i < records.length; i++) {
      final record = records[i];
      final accountInfo = accountInfos[i];

      try {
        if (!accountInfo.exists || accountInfo.data.isEmpty) {
          results.add(RecordRetrievalResult(
            record: record,
            error: 'Record not found',
          ));
          continue;
        }

        final data = accountInfo.data;

        if (data.length < 77) {
          results.add(RecordRetrievalResult(
            record: record,
            error: 'Invalid record data length',
          ));
          continue;
        }

        // Parse the content length (4 bytes, little endian at offset 73)
        final contentLength =
            (data[73]) | (data[74] << 8) | (data[75] << 16) | (data[76] << 24);

        const contentOffset = 77;

        if (contentOffset + contentLength > data.length) {
          results.add(RecordRetrievalResult(
            record: record,
            error: 'Content length exceeds account data size',
          ));
          continue;
        }

        // Extract the content data
        final content = Uint8List.fromList(
            data.sublist(contentOffset, contentOffset + contentLength));

        String result;
        if (!deserialize) {
          // Return raw content as hex
          result =
              content.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
        } else {
          // Deserialize the content based on record type
          result = deserializeRecordV2Content(content, record);
        }

        results.add(RecordRetrievalResult(
          record: record,
          retrievedRecord: result,
        ));
      } on Exception catch (e) {
        results.add(RecordRetrievalResult(
          record: record,
          error: 'Deserialization failed: $e',
        ));
      }
    }

    return results;
  } on Exception catch (e) {
    // If batch fetch fails, return error results for all records
    return records
        .map((record) => RecordRetrievalResult(
              record: record,
              error: 'Batch fetch failed: $e',
            ))
        .toList();
  }
}

/// Convenience function to get multiple records and return only successful results
///
/// This function filters out failed retrievals and returns only successfully
/// retrieved records as a Map for easy access.
///
/// Examples:
/// ```dart
/// final records = await getMultipleRecordsV2Map(
///   client,
///   'example.sol',
///   [Record.eth, Record.sol, Record.url]
/// );
///
/// final ethAddress = records[Record.eth];
/// final solAddress = records[Record.sol];
/// ```
///
/// @param connection The RPC client for blockchain interaction
/// @param domain The domain name to retrieve records for
/// @param records List of record types to retrieve
/// @param deserialize Whether to deserialize the content (defaults to true)
/// @returns Map of Record to retrieved content (only successful retrievals)
Future<Map<Record, String>> getMultipleRecordsV2Map(
  RpcClient connection,
  String domain,
  List<Record> records, {
  bool deserialize = true,
}) async {
  final results = await getMultipleRecordsV2(
    connection,
    domain,
    records,
    deserialize: deserialize,
  );

  final successfulRecords = <Record, String>{};

  for (final result in results) {
    if (result.isSuccess) {
      successfulRecords[result.record] = result.retrievedRecord!;
    }
  }

  return successfulRecords;
}
