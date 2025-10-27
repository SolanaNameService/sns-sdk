// Copyright 2023-2025 Immadominion & SNS DAO Contributors
// SPDX-License-Identifier: MIT

import 'dart:convert';
import 'dart:typed_data';
import 'package:solana/solana.dart';
import '../constants/addresses.dart';
import '../instructions/instruction_types.dart';
import '../rpc/rpc_client.dart' as sns_rpc;
import '../utils/name_hash.dart';

/// Parameters for creating a subdomain
class CreateSubdomainParams {
  const CreateSubdomainParams({
    required this.rpc,
    required this.subdomain,
    required this.parentOwner,
    required this.ttl,
    this.feePayer,
  });

  /// The RPC client
  final sns_rpc.RpcClient rpc;

  /// The fully qualified subdomain name (e.g., "sub.domain.sol")
  final String subdomain;

  /// The owner of the parent domain
  final Ed25519HDPublicKey parentOwner;

  /// The TTL (Time to Live) value for the subdomain
  final int ttl;

  /// Optional fee payer (defaults to parentOwner if not provided)
  final Ed25519HDPublicKey? feePayer;
}

/// Create subdomain instruction result
class CreateSubdomainResult {
  const CreateSubdomainResult({
    required this.instructions,
    required this.subdomainKey,
  });

  /// The transaction instructions
  final List<TransactionInstruction> instructions;

  /// The subdomain key
  final Ed25519HDPublicKey subdomainKey;
}

/// Create a subdomain instruction
///
/// This function mirrors the JS SDK's createSubdomain function
/// and creates a subdomain under the specified parent domain
///
/// @param params - Parameters for creating a subdomain
///
/// @returns Instructions for creating the subdomain
Future<CreateSubdomainResult> createSubdomain(
    CreateSubdomainParams params) async {
  final actualFeePayer = params.feePayer ?? params.parentOwner;
  final parts = params.subdomain.split('.');

  if (parts.length < 2) {
    throw ArgumentError(
        'Subdomain must include parent domain (e.g., "sub.domain.sol")');
  }

  final subName = parts[0];
  final parentName = parts.sublist(1).join('.');

  // Calculate hashes
  final parentHash = await nameHash(parentName);
  final subHash = await nameHash(params.subdomain);

  // Create program ID
  final programId = Ed25519HDPublicKey.fromBase58(nameProgramAddress);

  // Create central state address using PDA derivation
  final centralStateAddress = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [utf8.encode('central_state')],
    programId: programId,
  );

  // Create parent domain address using PDA derivation
  final parentDomainKey = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [parentHash],
    programId: programId,
  );

  // Create subdomain address using PDA derivation
  final subdomainKey = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [subHash],
    programId: programId,
  );

  // System program ID
  final systemProgramId = Ed25519HDPublicKey.fromBase58(systemProgramAddress);

  // Create data for instruction
  final dataBuffer = ByteData(1 + subName.length + 1 + 4)
    ..setUint8(0, 9); // Write discriminator (9 for createSubdomain)

  // Write subdomain name bytes
  for (var i = 0; i < subName.length; i++) {
    dataBuffer.setUint8(1 + i, subName.codeUnitAt(i));
  }

  dataBuffer
    ..setUint8(1 + subName.length, 0) // Write null terminator
    ..setUint32(1 + subName.length + 1, params.ttl, Endian.little); // Write TTL

  // Create the instruction
  final instruction = TransactionInstruction(
    programAddress: programId.toBase58(),
    accounts: [
      AccountMeta(
        address: centralStateAddress.toBase58(),
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: parentDomainKey.toBase58(),
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: subdomainKey.toBase58(),
        role: AccountRole.writable,
      ),
      AccountMeta(
        address: params.parentOwner.toBase58(),
        role: AccountRole.writableSigner,
      ),
      AccountMeta(
        address: systemProgramId.toBase58(),
        role: AccountRole.readonly,
      ),
      AccountMeta(
        address: actualFeePayer.toBase58(),
        role: AccountRole.writableSigner,
      ),
    ],
    data: Uint8List.view(dataBuffer.buffer),
  );

  return CreateSubdomainResult(
    instructions: [instruction],
    subdomainKey: subdomainKey,
  );
}
