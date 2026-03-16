/// Get a single Record V2 by domain and record type
///
/// This module provides functionality to retrieve a single Record V2 account,
/// following the exact implementation pattern of the JavaScript SDK.
library;

import 'dart:async';
import 'dart:typed_data';

import '../constants/records.dart';
import '../errors/sns_errors.dart';
import '../rpc/rpc_client.dart';
import '../types/record.dart';
import 'deserialize_record_v2_content.dart';
import 'get_record_v2_key.dart';

/// Retrieves a single Record V2 by domain and record type
///
/// This function fetches the Record V2 account data from Solana and deserializes
/// the content, matching the JavaScript SDK implementation exactly.
///
/// Examples:
/// ```dart
/// final ethAddress = await getRecordV2(
///   client,
///   'example.sol',
///   Record.eth
/// );
///
/// final solAddress = await getRecordV2(
///   client,
///   'example.sol',
///   Record.sol
/// );
/// ```
///
/// @param connection The RPC client for blockchain interaction
/// @param domain The domain name to retrieve the record for
/// @param record The record type to retrieve
/// @param deserialize Whether to deserialize the content (defaults to true)
/// @returns The record content as string if found and deserialize is true,
///          or the raw content as hex string if deserialize is false
/// @throws [AccountDoesNotExistError] if the record account does not exist
/// @throws [InvalidRecordDataError] if the record data is malformed
/// @throws [StaleRecordError] if the record is stale (staleness check disabled by default)
Future<String> getRecordV2(
  RpcClient connection,
  String domain,
  Record record, {
  bool deserialize = true,
}) async {
  try {
    // Get the record key for this domain and record type
    final recordKey = await getRecordV2Key(domain, record);

    // Fetch the account data from Solana
    final accountInfo = await connection.fetchEncodedAccount(recordKey);

    if (!accountInfo.exists || accountInfo.data.isEmpty) {
      throw AccountDoesNotExistError(
          'Record not found for domain: $domain, record: ${record.name}');
    }

    final data = Uint8List.fromList(accountInfo.data);

    // Parse the account data structure
    // Record V2 account structure:
    // - 8 bytes: discriminator
    // - 32 bytes: domain key
    // - 32 bytes: record key
    // - 1 byte: staleness_id
    // - 4 bytes: content length (little endian)
    // - N bytes: content data

    if (data.length < 77) {
      // 8 + 32 + 32 + 1 + 4 = 77 minimum
      throw InvalidRecordDataError('Record account data too short');
    }

    // Skip discriminator (8 bytes), domain key (32 bytes), record key (32 bytes), staleness_id (1 byte)
    const contentLengthOffset = 73;

    // Read content length (4 bytes, little endian)
    final contentLength = (data[contentLengthOffset]) |
        (data[contentLengthOffset + 1] << 8) |
        (data[contentLengthOffset + 2] << 16) |
        (data[contentLengthOffset + 3] << 24);

    const contentOffset = 77;

    if (contentOffset + contentLength > data.length) {
      throw InvalidRecordDataError('Content length exceeds account data size');
    }

    // Extract the content data
    final content = data.sublist(contentOffset, contentOffset + contentLength);

    if (!deserialize) {
      // If not deserializing, return the raw content as hex
      return content.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
    }

    // Deserialize the content based on record type
    return deserializeRecordV2Content(content, record);
  } on Exception catch (e) {
    if (e is SnsError) {
      rethrow;
    }
    throw AccountDoesNotExistError('Failed to retrieve record: $e');
  }
}

/// Extended version of getRecordV2 that returns full record information
///
/// This function provides additional metadata about the record including
/// staleness information and raw content.
///
/// @param connection The RPC client for blockchain interaction
/// @param domain The domain name to retrieve the record for
/// @param record The record type to retrieve
/// @returns RecordResult containing all record information
Future<RecordResult> getRecordV2Extended(
  RpcClient connection,
  String domain,
  Record record,
) async {
  try {
    final recordKey = await getRecordV2Key(domain, record);

    final accountInfo = await connection.fetchEncodedAccount(recordKey);

    if (!accountInfo.exists || accountInfo.data.isEmpty) {
      throw AccountDoesNotExistError(
          'Record not found for domain: $domain, record: ${record.name}');
    }

    final data = Uint8List.fromList(accountInfo.data);

    if (data.length < 77) {
      throw InvalidRecordDataError('Record account data too short');
    }

    // Parse staleness_id (1 byte at offset 72)
    final stalenessId = data[72];

    // Read content length (4 bytes, little endian at offset 73)
    final contentLength =
        (data[73]) | (data[74] << 8) | (data[75] << 16) | (data[76] << 24);

    const contentOffset = 77;

    if (contentOffset + contentLength > data.length) {
      throw InvalidRecordDataError('Content length exceeds account data size');
    }

    final content = data.sublist(contentOffset, contentOffset + contentLength);

    // Return RecordResult with proper parameters
    return RecordResult(
      content: content,
      stale:
          stalenessId > 0, // Simple staleness check - true if staleness_id > 0
    );
  } on Exception catch (e) {
    if (e is SnsError) {
      rethrow;
    }
    throw AccountDoesNotExistError('Failed to retrieve extended record: $e');
  }
}
