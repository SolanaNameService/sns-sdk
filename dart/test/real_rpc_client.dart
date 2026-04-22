/// Real RPC client for testing
///
/// Provides real RPC connections for integration testing
/// Mirrors the JavaScript SDK test setup
library;

import 'package:sns_sdk/sns_sdk.dart';

import 'constants.dart';

/// Create a real RPC client for testing
EnhancedSolanaRpcClient createRealRpcClient() =>
    EnhancedSolanaRpcClient(testRpcUrl);
