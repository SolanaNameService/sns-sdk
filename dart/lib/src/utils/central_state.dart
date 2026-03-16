// Copyright 2023-2025 Immadominion & SNS DAO Contributors
// SPDX-License-Identifier: MIT

import 'dart:typed_data';
import 'package:solana/solana.dart';
import '../constants/addresses.dart';

/// Find the address for the central state
///
/// Returns the central state public key for the SNS program
Future<Ed25519HDPublicKey> findCentralStateAddress() async {
  final programId = Ed25519HDPublicKey.fromBase58(registryProgramAddress);
  final seed = Uint8List.fromList('central_state'.codeUnits);

  final result = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [seed],
    programId: programId,
  );

  return result;
}
