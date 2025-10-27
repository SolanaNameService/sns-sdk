import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import '../rpc/rpc_client.dart';

/// Enhanced RPC exception for better error handling
class RpcException implements Exception {
  const RpcException(
    this.message, {
    this.code,
    this.statusCode,
    this.method,
    this.data,
    this.originalError,
  });
  final String message;
  final int? code;
  final int? statusCode;
  final String? method;
  final dynamic data;
  final dynamic originalError;

  @override
  String toString() {
    final buffer = StringBuffer('RpcException: $message');
    if (method != null) buffer.write(' (method: $method)');
    if (code != null) buffer.write(' (code: $code)');
    if (statusCode != null) buffer.write(' (status: $statusCode)');
    return buffer.toString();
  }
}

/// Enhanced HTTP-based RPC client for Solana network connections
class HttpRpcClient implements RpcClient {
  HttpRpcClient(
    this.endpoint, {
    http.Client? client,
    this.timeout = const Duration(seconds: 30),
    this.maxBatchSize = 100,
  }) : _client = client ?? http.Client();
  final String endpoint;
  final http.Client _client;
  final Duration timeout;
  final int maxBatchSize;

  int _id = 0;
  int get _nextId => ++_id;

  Future<Map<String, dynamic>> _call(
    String method,
    List<dynamic> params, {
    Duration? customTimeout,
  }) async {
    final requestBody = jsonEncode({
      'jsonrpc': '2.0',
      'id': _nextId,
      'method': method,
      'params': params,
    });

    try {
      final response = await _client
          .post(
            Uri.parse(endpoint),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: requestBody,
          )
          .timeout(customTimeout ?? timeout);

      if (response.statusCode != 200) {
        throw RpcException(
          'HTTP ${response.statusCode}: ${response.reasonPhrase}',
          statusCode: response.statusCode,
          method: method,
        );
      }

      final data = jsonDecode(response.body) as Map<String, dynamic>;

      if (data.containsKey('error')) {
        final error = data['error'] as Map<String, dynamic>;
        throw RpcException(
          error['message'] ?? 'Unknown RPC error',
          code: error['code'],
          method: method,
          data: error['data'],
        );
      }

      return data;
    } on RpcException {
      rethrow;
    } on Exception catch (e) {
      throw RpcException(
        'Network error: $e',
        method: method,
        originalError: e,
      );
    }
  }

  void _validateAddress(String address) {
    if (address.isEmpty) {
      throw const RpcException('Address cannot be empty');
    }
    if (address.length < 32 || address.length > 44) {
      throw RpcException(
          'Invalid address length: $address (${address.length} chars)');
    }
  }

  AccountInfo _parseAccountInfo(dynamic result) {
    if (result == null) {
      return AccountInfo(exists: false, data: Uint8List(0).toList());
    }

    return AccountInfo(
      exists: true,
      data: base64.decode(result['data'][0]),
    );
  }

  @override
  Future<AccountInfo> fetchEncodedAccount(String address) async {
    _validateAddress(address);

    final data = await _call('getAccountInfo', [
      address,
      {'encoding': 'base64', 'commitment': 'confirmed'},
    ]);

    final result = data['result']['value'];
    return _parseAccountInfo(result);
  }

  @override
  Future<List<AccountInfo>> fetchEncodedAccounts(List<String> addresses) async {
    if (addresses.isEmpty) return [];

    // Enhanced batch processing
    if (addresses.length > maxBatchSize) {
      return _fetchAccountsInBatches(addresses);
    }

    for (final address in addresses) {
      _validateAddress(address);
    }

    final data = await _call('getMultipleAccounts', [
      addresses,
      {'encoding': 'base64', 'commitment': 'confirmed'},
    ]);

    final results = data['result']['value'] as List;
    return results.map(_parseAccountInfo).toList();
  }

  Future<List<AccountInfo>> _fetchAccountsInBatches(
    List<String> addresses,
  ) async {
    final batches = <List<String>>[];
    for (var i = 0; i < addresses.length; i += maxBatchSize) {
      final endIndex = (i + maxBatchSize > addresses.length)
          ? addresses.length
          : i + maxBatchSize;
      batches.add(addresses.sublist(i, endIndex));
    }

    final results = <AccountInfo>[];
    for (final batch in batches) {
      final batchResults = await fetchEncodedAccounts(batch);
      results.addAll(batchResults);
    }

    return results;
  }

  @override
  Future<List<TokenAccountValue>> getTokenLargestAccounts(String mint) async {
    try {
      final data = await _call('getTokenLargestAccounts', [mint]);

      final results = data['result']['value'] as List;
      return results
          .map((result) => TokenAccountValue(
                address: result['address'],
                amount: result['amount'],
              ))
          .toList();
    } on Exception catch (e) {
      throw RpcException(
        'Failed to get token largest accounts: $e',
        method: 'getTokenLargestAccounts',
        originalError: e,
      );
    }
  }

  @override
  Future<List<ProgramAccount>> getProgramAccounts(
    String programId, {
    required String encoding,
    required List<AccountFilter> filters,
    DataSlice? dataSlice,
    int? limit,
  }) async {
    try {
      final config = <String, dynamic>{'encoding': encoding};

      if (filters.isNotEmpty) {
        config['filters'] = filters.map((filter) {
          if (filter is MemcmpFilter) {
            return {
              'memcmp': {
                'offset': filter.offset,
                'bytes': filter.bytes,
                'encoding': filter.encoding,
              }
            };
          } else if (filter is DataSizeFilter) {
            return {'dataSize': filter.size};
          }
          return {};
        }).toList();
      }

      if (dataSlice != null) {
        config['dataSlice'] = {
          'offset': dataSlice.offset,
          'length': dataSlice.length,
        };
      }

      if (limit != null) {
        config['limit'] = limit;
      }

      final data = await _call('getProgramAccounts', [programId, config]);

      final results = data['result'] as List;
      return results
          .map((result) => ProgramAccount(
                pubkey: result['pubkey'],
                account: AccountInfo(
                  exists: true,
                  data: encoding == 'base64'
                      ? base64.decode(result['account']['data'][0])
                      : Uint8List.fromList(
                              result['account']['data'] as List<int>)
                          .toList(),
                ),
              ))
          .toList();
    } on Exception catch (e) {
      throw RpcException(
        'Failed to get program accounts: $e',
        method: 'getProgramAccounts',
        originalError: e,
      );
    }
  }

  void dispose() {
    _client.close();
  }
}
