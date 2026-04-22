import '../constants/records.dart';
import '../record/deserialize_record.dart';
import '../record/get_record_key_sync.dart';
import '../rpc/rpc_client.dart';
import '../states/registry.dart';

/// Retrieves multiple records for a domain with optional deserialization
///
/// This function mirrors js/src/record/getRecords.ts with strict parity
///
/// [rpc] - The Solana RPC connection object
/// [domain] - The .sol domain name
/// [records] - List of record types to retrieve
/// [deserialize] - Whether to deserialize the record content (default: false)
///
/// Returns list of RegistryState objects when deserialize=false,
/// or list of deserialized record content strings when deserialize=true
Future<List<dynamic>> getRecords(
  RpcClient rpc,
  String domain,
  List<Record> records, {
  bool deserialize = false,
}) async {
  // Get all record keys for the domain
  final pubkeyFutures =
      records.map((record) => getRecordKeySync(domain, record)).toList();
  final pubkeys = await Future.wait(pubkeyFutures);

  // Batch retrieve registry states
  final registries = await RegistryState.retrieveBatch(rpc, pubkeys);

  if (deserialize) {
    // Return deserialized content strings
    final results = <String?>[];
    for (var i = 0; i < registries.length; i++) {
      final registry = registries[i];
      if (registry == null) {
        results.add(null);
      } else {
        final content = deserializeRecord(
          registry,
          records[i],
          pubkeys[i],
        );
        results.add(content);
      }
    }
    return results;
  }

  // Return raw registry states
  return registries;
}

/// Type-safe version that returns deserialized content
Future<List<String?>> getRecordsDeserialized(
  RpcClient rpc,
  String domain,
  List<Record> records,
) async {
  final results = await getRecords(rpc, domain, records, deserialize: true);
  return results.cast<String?>();
}

/// Type-safe version that returns registry states
Future<List<RegistryState?>> getRecordsRaw(
  RpcClient rpc,
  String domain,
  List<Record> records,
) async {
  final results = await getRecords(rpc, domain, records);
  return results.cast<RegistryState?>();
}
