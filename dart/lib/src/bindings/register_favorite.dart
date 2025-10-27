import 'dart:convert';
import 'package:solana/solana.dart' hide RpcClient;

import '../constants/addresses.dart';
import '../instructions/instruction_types.dart';
import '../instructions/register_favorite_instruction.dart';
import '../rpc/rpc_client.dart';
import '../states/registry.dart';

/// Parameters for registering a favorite domain
class RegisterFavoriteParams {
  const RegisterFavoriteParams({
    required this.nameAccount,
    required this.owner,
  });

  /// The name account being registered as favorite
  final Ed25519HDPublicKey nameAccount;

  /// The owner of the name account
  final Ed25519HDPublicKey owner;
}

/// Registers a domain name as favorite
///
/// This function mirrors js/src/bindings/registerFavorite.ts
///
/// [rpc] - The Solana RPC connection object
/// [params] - The parameters for registering favorite domain
///
/// Returns the instruction to register the favorite domain
Future<TransactionInstruction> registerFavorite(
  RpcClient rpc,
  RegisterFavoriteParams params,
) async {
  Ed25519HDPublicKey? parent;

  try {
    final registry =
        await RegistryState.retrieve(rpc, params.nameAccount.toBase58());

    // Check if parent is not root domain account
    if (registry.parentName != rootDomainAddress) {
      parent = Ed25519HDPublicKey.fromBase58(registry.parentName);
    }
  } on Exception {
    // If we can't retrieve registry state, assume no parent
    parent = null;
  }

  // Get the favorite domain key using proper PDA derivation
  // This mirrors the JavaScript SDK's PublicKey.findProgramAddressSync pattern
  final favoriteKeySeeds = [
    utf8.encode("favourite_domain"), // Buffer.from("favourite_domain")
    params.owner.bytes, // owner.toBuffer()
  ];

  final favoriteKeyResult = await Ed25519HDPublicKey.findProgramAddress(
    seeds: favoriteKeySeeds,
    programId: Ed25519HDPublicKey.fromBase58(nameOffersAddress),
  );

  final instruction = RegisterFavoriteInstruction(
    params: RegisterFavoriteInstructionParams(
      nameAccount: params.nameAccount.toBase58(),
      favoriteAccount: favoriteKeyResult.toBase58(),
      owner: params.owner.toBase58(),
      systemProgram: systemProgramAddress,
      optParent: parent?.toBase58(),
      programAddress: nameOffersAddress,
    ),
  );

  return instruction.build();
}

/// Alias for registerFavorite - sets a domain as the primary domain
///
/// This mirrors the setPrimaryDomain export from the JavaScript SDK
Future<TransactionInstruction> setPrimaryDomain(
  RpcClient rpc,
  RegisterFavoriteParams params,
) =>
    registerFavorite(rpc, params);
