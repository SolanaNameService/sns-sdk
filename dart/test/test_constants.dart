/// Test constants for SNS SDK
///
/// Additional test constants and utilities
/// Supplements constants.dart with test-specific data
library;

import 'dart:io';

import 'package:dotenv/dotenv.dart';
import 'package:test/test.dart';

/// Get RPC URL from environment or default
String? getRpcUrl() {

  final env = DotEnv()..load(['.env']);
  final rpcUrl = env['RPC_URL'];

  if (rpcUrl == null || rpcUrl.isEmpty) {
    markTestSkipped('RPC_URL environment variable not set');
    return rpcUrl;
  }

  final envRpc = Platform.environment['RPC_URL'];
  if (envRpc != null && envRpc.isNotEmpty) {
    return envRpc;
  }

  return null; // Return null if no RPC URL available
}

/// Check if tests should be skipped due to missing RPC
bool shouldSkipTests() {
  return getRpcUrl() == null;
}

/// Print skip message for tests
void printSkipMessage(String testType) {
  // print('Skipping $testType tests: RPC_URL environment variable not set');
}

/// Random address for testing (system program alternative)
const randomAddress = '11111111111111111111111112';
