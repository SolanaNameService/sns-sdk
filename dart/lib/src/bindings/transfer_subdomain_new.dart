// Copyright 2023-2025 Immadominion & SNS DAO Contributors
// SPDX-License-Identifier: MIT

import 'dart:convert';
import 'dart:typed_data';

import 'package:solana/solana.dart';

import '../constants/addresses.dart';
import '../instructions/instruction_types.dart';
import '../rpc/rpc_client.dart' as sns_rpc;
import '../utils/name_hash.dart';

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

/// Transfer subdomain ownership
///
/// This function mirrors the JS SDK's transferSubdomain function
/// and transfers ownership of a subdomain to a new owner
///
/// @param params - Parameters for transferring a subdomain
///
/// @returns A transaction instruction for transferring the subdomain
Future<TransactionInstruction> transferSubdomain(
    TransferSubdomainParams params) async {
  final parts = params.subdomain.split('.');

  if (parts.length < 2) {
    throw ArgumentError(
        'Subdomain must include parent domain (e.g., "sub.domain.sol")');
  }

  // Calculate hashes
  final parentDomainName = parts.sublist(1).join('.');
  final parentHash = await nameHash(parentDomainName);
  final subHash = await nameHash(params.subdomain);

  // Create program ID
  final programId = Ed25519HDPublicKey.fromBase58(nameProgramAddress);

  // Create central state address
  final centralStateAddressPDA = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [utf8.encode('central_state')],
    programId: programId,
  );

  // Create subdomain address
  final subdomainPDA = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [subHash],
    programId: programId,
  );

  // Create parent domain address
  final parentDomainPDA = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [parentHash],
    programId: programId,
  );

  // Create data for instruction (10 is the discriminator for transferring)
  final data = Uint8List.fromList([10]);

  // Set up accounts based on transfer type
  final accounts = <AccountMeta>[
    AccountMeta(
      address: centralStateAddressPDA.toBase58(),
      role: AccountRole.readonly,
    ),
    AccountMeta(
      address: subdomainPDA.toBase58(),
      role: AccountRole.writable,
    ),
    AccountMeta(
      address: params.newOwner.toBase58(),
      role: AccountRole.readonly,
    ),
  ];

  // If we're transferring as parent owner, add parent accounts
  if (params.asParentOwner) {
    accounts.add(AccountMeta(
      address: parentDomainPDA.toBase58(),
      role: AccountRole.readonly,
    ));
    // The signer would be the parent domain owner in this case
  } else {
    // The signer would be the subdomain owner in this case
  }

  // Add system program
  accounts.add(const AccountMeta(
    address: systemProgramAddress,
    role: AccountRole.readonly,
  ));

  return TransactionInstruction(
    programAddress: nameProgramAddress,
    accounts: accounts,
    data: data,
  );
}
