// Copyright 2023-2025 Immadominion & SNS DAO Contributors
// SPDX-License-Identifier: MIT

import 'package:solana/solana.dart';
import 'package:solana/encoder.dart';
import '../instructions/instruction_types.dart' as sns;

/// Transaction configuration options
class TransactionConfig {
  const TransactionConfig({
    this.skipPreflight = false,
    this.maxRetries = 3,
  });

  /// Skip preflight transaction checks
  final bool skipPreflight;

  /// Maximum number of retry attempts
  final int maxRetries;
}

/// Result of transaction signing and sending
class TransactionResult {
  const TransactionResult({
    required this.signature,
    required this.transactionHash,
    this.slot,
  });

  /// Transaction signature
  final String signature;

  /// Transaction hash for verification
  final String transactionHash;

  /// Slot where transaction was processed (if confirmed)
  final int? slot;
}

/// Robust transaction signing and sending utility
///
/// This implementation provides complete transaction lifecycle management:
/// - Fetches recent blockhash from the network
/// - Builds properly formatted Solana transactions
/// - Handles signature ordering per Solana requirements
/// - Implements retry logic with exponential backoff
/// - Provides comprehensive error handling
/// - Supports various transaction configurations
class TransactionManager {
  /// Sign and send transaction with comprehensive error handling
  ///
  /// This method implements the complete Solana transaction workflow:
  /// 1. Fetch recent blockhash from RPC
  /// 2. Validate and prepare instructions
  /// 3. Build transaction with correct signature ordering
  /// 4. Sign transaction with provided signers
  /// 5. Send transaction to network with retry logic
  /// 6. Return transaction signature and metadata
  ///
  /// @param rpc - RPC client for network communication
  /// @param instructions - List of instructions to include in transaction
  /// @param signers - List of signers (first signer pays fees)
  /// @param feePayer - Optional explicit fee payer (defaults to first signer)
  /// @param config - Transaction configuration options
  ///
  /// @returns TransactionResult with signature and transaction data
  /// @throws RpcException - If RPC calls fail
  /// @throws TransactionException - If transaction building/signing fails
  static Future<TransactionResult> signAndSendTransaction({
    required RpcClient rpc,
    required List<sns.TransactionInstruction> instructions,
    required List<Ed25519HDKeyPair> signers,
    Ed25519HDPublicKey? feePayer,
    TransactionConfig config = const TransactionConfig(),
  }) async {
    if (signers.isEmpty) {
      throw ArgumentError('At least one signer is required');
    }

    if (instructions.isEmpty) {
      throw ArgumentError('At least one instruction is required');
    }

    // Use first signer as fee payer if not explicitly provided
    final feePayerKey = feePayer ?? signers.first.publicKey;

    try {
      // Step 1: Fetch recent blockhash
      final recentBlockhash = await _getRecentBlockhash(rpc);

      // Step 2: Validate instructions
      _validateInstructions(instructions);

      // Step 3: Build Solana Instructions
      final solanaInstructions = _buildSolanaInstructions(instructions);

      // Step 4: Create and sign transaction
      final encodedTransaction = await _createSignedTransaction(
        instructions: solanaInstructions,
        recentBlockhash: recentBlockhash,
        signers: signers,
        feePayer: feePayerKey,
      );

      // Step 5: Send transaction with retry logic
      final signature = await _sendTransactionWithRetry(
        rpc,
        encodedTransaction,
        config,
      );

      return TransactionResult(
        signature: signature,
        transactionHash: signature,
      );
    } catch (e) {
      if (e is TransactionException || e is RpcException) {
        rethrow;
      }
      throw TransactionException('Unexpected error during transaction: $e');
    }
  }

  /// Fetch recent blockhash from the network
  static Future<String> _getRecentBlockhash(RpcClient rpc) async {
    try {
      final response = await rpc.getLatestBlockhash();
      return response.value.blockhash;
    } catch (e) {
      throw RpcException('Failed to fetch recent blockhash: $e');
    }
  }

  /// Validate instruction format and ordering
  static void _validateInstructions(
      List<sns.TransactionInstruction> instructions) {
    for (final instruction in instructions) {
      try {
        instruction.validateAccountOrdering();
      } catch (e) {
        throw TransactionException('Invalid instruction account ordering: $e');
      }
    }
  }

  /// Build Solana Instructions from SNS TransactionInstructions
  static List<Instruction> _buildSolanaInstructions(
    List<sns.TransactionInstruction> instructions,
  ) {
    return instructions.map((instruction) {
      final accounts = instruction.accounts.map((account) {
        // Convert to Solana AccountMeta format
        return AccountMeta(
          pubKey: Ed25519HDPublicKey.fromBase58(account.address),
          isSigner: account.isSigner,
          isWriteable: account.isWritable,
        );
      }).toList();

      return Instruction(
        programId: Ed25519HDPublicKey.fromBase58(instruction.programAddress),
        accounts: accounts,
        data: ByteArray(instruction.data),
      );
    }).toList();
  }

  /// Create signed transaction using proper Solana workflow
  static Future<String> _createSignedTransaction({
    required List<Instruction> instructions,
    required String recentBlockhash,
    required List<Ed25519HDKeyPair> signers,
    required Ed25519HDPublicKey feePayer,
  }) async {
    try {
      // Create message from instructions
      final message = Message(instructions: instructions);

      // Compile the message with blockhash and fee payer
      final compiledMessage = message.compile(
        recentBlockhash: recentBlockhash,
        feePayer: feePayer,
      );

      // Create signatures for the compiled message using helper function
      final signatures = await Future.wait(
        signers.map((signer) => signer.sign(compiledMessage.toByteArray())),
      );

      // Create SignedTx
      final signedTx = SignedTx(
        signatures: signatures,
        compiledMessage: compiledMessage,
      );

      return signedTx.encode();
    } catch (e) {
      throw TransactionException('Failed to create and sign transaction: $e');
    }
  }

  /// Send transaction with retry logic and exponential backoff
  static Future<String> _sendTransactionWithRetry(
    RpcClient rpc,
    String encodedTransaction,
    TransactionConfig config,
  ) async {
    int attempt = 0;
    Duration delay = const Duration(milliseconds: 500);

    while (attempt < config.maxRetries) {
      try {
        // Send the encoded signed transaction
        final signature = await rpc.sendTransaction(
          encodedTransaction,
          skipPreflight: config.skipPreflight,
        );

        return signature;
      } catch (e) {
        attempt++;

        if (attempt >= config.maxRetries) {
          throw TransactionException(
            'Failed to send transaction after ${config.maxRetries} attempts: $e',
          );
        }

        // Exponential backoff
        await Future.delayed(delay);
        delay *= 2;
      }
    }

    throw TransactionException('Unexpected error in transaction retry logic');
  }
}

/// Legacy function wrapper for backward compatibility
///
/// This function maintains the original API while leveraging the robust
/// implementation under the hood. Existing code can continue to use this
/// function without modification.
Future<String> signAndSendTransaction({
  required RpcClient rpc,
  required List<sns.TransactionInstruction> instructions,
  required List<Ed25519HDKeyPair> signers,
  required Ed25519HDPublicKey feePayer,
}) async {
  final result = await TransactionManager.signAndSendTransaction(
    rpc: rpc,
    instructions: instructions,
    signers: signers,
    feePayer: feePayer,
  );

  return result.signature;
}

/// Exception thrown when transaction operations fail
class TransactionException implements Exception {
  const TransactionException(this.message);
  final String message;

  @override
  String toString() => 'TransactionException: $message';
}

/// Exception thrown when RPC operations fail
class RpcException implements Exception {
  const RpcException(this.message);
  final String message;

  @override
  String toString() => 'RpcException: $message';
}
