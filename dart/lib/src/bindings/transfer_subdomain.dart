// Copyright 2023-2025 Immadominion & SNS DAO Contributors
// SPDX-License-Identifier: MIT

import 'package:solana/solana.dart';

import '../constants/addresses.dart';
import '../errors/sns_errors.dart';
import '../instructions/instruction_types.dart';
import '../instructions/transfer_instruction.dart';
import '../rpc/rpc_client.dart' as sns_rpc;
import '../states/registry.dart';
import '../utils/get_domain_key_sync.dart';

/// Parameters for transferring a subdomain
class TransferSubdomainParams {
  const TransferSubdomainParams({
    required this.rpc,
    required this.subdomain,
    required this.newOwner,
    required this.asParentOwner,
  });

  /// The RPC client
  final sns_rpc.RpcClient rpc;

  /// The fully qualified subdomain name (e.g., "sub.domain.sol")
  final String subdomain;

  /// The new owner of the subdomain
  final Ed25519HDPublicKey newOwner;

  /// Whether to transfer ownership as parent owner instead of subdomain owner
  final bool asParentOwner;
}

/// Result of transferring a subdomain
class TransferSubdomainResult {
  const TransferSubdomainResult({
    required this.instruction,
    required this.subdomainKey,
  });

  /// The transaction instruction
  final TransactionInstruction instruction;

  /// The subdomain key
  final Ed25519HDPublicKey subdomainKey;
}

/// Transfer subdomain ownership
///
/// This function mirrors the JS SDK's transferSubdomain function
/// and transfers ownership of a subdomain to a new owner
///
/// [params] - Parameters for transferring a subdomain
///
/// Returns an instruction for transferring the subdomain
Future<TransferSubdomainResult> transferSubdomain(
    TransferSubdomainParams params) async {
  // Get domain key and validate it's a subdomain
  final domainResult = await getDomainKeySync(params.subdomain);

  if (!domainResult.isSub || domainResult.parent == null) {
    throw SnsError(ErrorType.invalidSubdomain, 'The subdomain is not valid');
  }

  final subdomainKey = Ed25519HDPublicKey.fromBase58(domainResult.pubkey);

  // Get current owner if not provided
  Ed25519HDPublicKey? currentOwner;
  try {
    final registryState =
        await RegistryState.retrieve(params.rpc, domainResult.pubkey);
    currentOwner = Ed25519HDPublicKey.fromBase58(registryState.owner);
  } on Exception {
    // If we can't get the owner, we'll let the instruction fail
    throw SnsError(
        ErrorType.accountDoesNotExist, 'Could not retrieve subdomain owner');
  }

  // Optional: Get parent owner if transferring as parent owner
  Ed25519HDPublicKey? parentOwner;
  if (params.asParentOwner) {
    try {
      final parentRegistryState =
          await RegistryState.retrieve(params.rpc, domainResult.parent!);
      parentOwner = Ed25519HDPublicKey.fromBase58(parentRegistryState.owner);
    } on Exception {
      throw SnsError(ErrorType.accountDoesNotExist,
          'Could not retrieve parent domain owner');
    }
  }

  // Create transfer instruction parameters
  final transferParams = TransferInstructionParams(
    newOwner: params.newOwner.toBase58(),
    programAddress: nameProgramAddress,
    domainAddress: domainResult.pubkey,
    currentOwner: currentOwner.toBase58(),
    parentAddress: params.asParentOwner ? domainResult.parent : null,
    parentOwner: params.asParentOwner ? parentOwner?.toBase58() : null,
  );

  // Create the transfer instruction
  final instruction = TransferInstruction(
    newOwner: params.newOwner.toBase58(),
    params: transferParams,
  );

  return TransferSubdomainResult(
    instruction: instruction.build(),
    subdomainKey: subdomainKey,
  );
}
