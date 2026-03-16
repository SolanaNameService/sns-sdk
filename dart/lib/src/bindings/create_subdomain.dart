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

  /// The RPC client for blockchain interaction
  final sns_rpc.RpcClient rpc;

  /// The fully qualified subdomain name (e.g., "sub.domain.sol")
  final String subdomain;

  /// The owner of the parent domain (must have permission to create subdomains)
  final Ed25519HDPublicKey parentOwner;

  /// The TTL (Time to Live) value for the subdomain in seconds
  final int ttl;

  /// Optional fee payer for the transaction (defaults to parentOwner if not provided)
  final Ed25519HDPublicKey? feePayer;
}

/// Creates a subdomain instruction for a parent domain.
///
/// Generates a transaction instruction that creates a subdomain under an
/// existing parent domain. The parent domain owner must sign the transaction
/// to authorize subdomain creation.
///
/// [params] Parameters specifying the subdomain, parent owner, and TTL
///
/// Returns a list containing the subdomain creation instruction
///
/// ```dart
/// final instructions = await createSubdomain(CreateSubdomainParams(
///   rpc: rpc,
///   subdomain: 'api.example',
///   parentOwner: domainOwnerKey,
///   ttl: 86400, // 1 day
/// ));
///
/// // Add to transaction and send
/// final transaction = Transaction()..addAll(instructions);
/// ```
/// and creates a subdomain under the specified parent domain
///
/// @param params - Parameters for creating a subdomain
///
/// @returns A list of instructions for creating the subdomain
Future<List<TransactionInstruction>> createSubdomain(
    CreateSubdomainParams params) async {
  if (params.subdomain.isEmpty) {
    throw ArgumentError('Subdomain cannot be empty');
  }

  final actualFeePayer = params.feePayer ?? params.parentOwner;
  final parts = params.subdomain.split('.');

  if (parts.length < 2) {
    throw ArgumentError(
        'Subdomain must include parent domain (e.g., "sub.domain.sol")');
  }

  if (parts[0].isEmpty) {
    throw ArgumentError('Subdomain name cannot be empty');
  }

  // Check TTL - should be positive
  if (params.ttl <= 0) {
    throw ArgumentError('TTL must be a positive number');
  }

  final subName = parts[0];
  final parentName = parts.sublist(1).join('.');

  // Calculate hashes
  final parentHash = await nameHash(parentName);
  final subHash = await nameHash(params.subdomain);

  // Create program ID
  final programId = Ed25519HDPublicKey.fromBase58(nameProgramAddress);

  // Create central state address using PDA derivation
  final centralStateAddressPDA = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [utf8.encode('central_state')],
    programId: programId,
  );
  final centralStateAddress = centralStateAddressPDA;

  // Create parent domain address using PDA derivation
  final parentDomainPDA = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [parentHash],
    programId: programId,
  );
  final parentDomainKey = parentDomainPDA;

  // Create subdomain address using PDA derivation
  final subdomainPDA = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [subHash],
    programId: programId,
  );
  final subdomainKey = subdomainPDA;

  // System program address - use directly from constants

  // Create data for instruction
  // Data format:
  // [0]: discriminator (9 for createSubdomain)
  // [1..n]: subdomain name bytes
  // [n+1]: null terminator
  // [n+2..n+6]: TTL as little-endian uint32
  try {
    final dataBuffer = ByteData(1 + subName.length + 1 + 4);

    // Write discriminator (9 for createSubdomain)
    dataBuffer.setUint8(0, 9);

    // Write subdomain name bytes
    for (var i = 0; i < subName.length; i++) {
      dataBuffer.setUint8(1 + i, subName.codeUnitAt(i));
    }

    // Write null terminator
    dataBuffer.setUint8(1 + subName.length, 0);

    // Write TTL as little-endian uint32
    dataBuffer.setUint32(1 + subName.length + 1, params.ttl, Endian.little);

    // Create the instruction
    return [
      TransactionInstruction(
        programAddress: nameProgramAddress,
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
          const AccountMeta(
            address: systemProgramAddress,
            role: AccountRole.readonly,
          ),
          AccountMeta(
            address: actualFeePayer.toBase58(),
            role: AccountRole.writableSigner,
          ),
        ],
        data: Uint8List.view(dataBuffer.buffer),
      )
    ];
  } on Exception catch (e) {
    throw ArgumentError(
        'Failed to create subdomain instruction: ${e.toString()}');
  }
}
