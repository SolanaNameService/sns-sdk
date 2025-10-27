/// Core record retrieval functionality for SNS domains
///
/// This module provides the main `getRecord` function that serves as the foundation
/// for all record type specific helper functions. It mirrors the functionality
/// from the JavaScript SDK exactly.
library;

import '../constants/records.dart';
import '../errors/sns_errors.dart';
import '../rpc/rpc_client.dart';
import '../states/registry.dart';
import 'deserialize_record.dart';
import 'get_record_key_sync.dart';

/// Retrieves a specified record for the given domain name
///
/// This function provides the core functionality for all record retrieval operations.
/// It can return either the raw [RegistryState] or the deserialized string content
/// based on the [deserialize] parameter.
///
/// Examples:
/// ```dart
/// // Get deserialized email record
/// final email = await getRecord(rpcClient, 'example', Record.email, true);
///
/// // Get raw registry state for custom processing
/// final state = await getRecord(rpcClient, 'example', Record.email, false);
/// ```
///
/// @param connection The RPC client for Solana blockchain communication
/// @param domain The .sol domain name (without the .sol suffix)
/// @param record The record type to retrieve
/// @param deserialize Whether to deserialize the record content to a string
/// @returns The record content as string (if deserialize=true) or RegistryState (if deserialize=false)
/// @throws [NoRecordDataError] if the record data is empty
/// @throws [InvalidRecordDataError] if deserialization fails
Future<dynamic> getRecord(
  RpcClient connection,
  String domain,
  Record record,
  bool deserialize,
) async {
  final pubkey = getRecordKeySync(domain, record);
  final registry = await RegistryState.retrieve(connection, await pubkey);

  if (registry.data == null || registry.data!.isEmpty) {
    throw NoRecordDataError('The record data is empty for domain $domain');
  }

  if (deserialize) {
    return deserializeRecord(registry, record, await pubkey);
  }

  // For non-deserialized case, trim to record size if available
  final recordSize = getRecordSize(record);
  if (recordSize != null && registry.data!.length > recordSize) {
    final newData = registry.data!.sublist(0, recordSize);
    return RegistryState(
      parentName: registry.parentName,
      owner: registry.owner,
      classAddress: registry.classAddress,
      data: newData,
    );
  }

  return registry;
}

/// Overloaded version for deserialized records
Future<String?> getRecordDeserialized(
  RpcClient connection,
  String domain,
  Record record,
) async =>
    await getRecord(connection, domain, record, true) as String?;

/// Overloaded version for raw registry state
Future<RegistryState?> getRecordRaw(
  RpcClient connection,
  String domain,
  Record record,
) async =>
    await getRecord(connection, domain, record, false) as RegistryState?;
