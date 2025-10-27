// Copyright 2023-2025 Immadominion & SNS DAO Contributors
// SPDX-License-Identifier: MIT

import 'package:solana/solana.dart';

/// Find the associated token address for a given mint and owner
///
/// @param mint - Mint address
/// @param owner - Owner address
/// @returns Associated token address
Future<Ed25519HDPublicKey> findAssociatedTokenAddress({
  required Ed25519HDPublicKey mint,
  required Ed25519HDPublicKey owner,
}) async {
  final associatedProgramId = Ed25519HDPublicKey.fromBase58(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  );

  final tokenProgramId = Ed25519HDPublicKey.fromBase58(
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  );

  final address = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [
      owner.bytes,
      tokenProgramId.bytes,
      mint.bytes,
    ],
    programId: associatedProgramId,
  );

  return address;
}
