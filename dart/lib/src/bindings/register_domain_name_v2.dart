import 'package:solana/solana.dart' as solana;

import '../client/sns_client.dart';
import '../constants/addresses.dart';
import '../errors/sns_errors.dart';
import '../instructions/create_split_v2_instruction.dart';
import '../instructions/instruction_types.dart';
import '../utils/create_associated_token_account.dart';
import '../utils/get_domain_key_sync.dart';
import '../utils/get_pyth_feed_account_key.dart';

/// Registers a domain name using the V2 instruction set.
///
/// This function performs domain registration with V2 instruction support,
/// referrer handling, token operations, and Pyth feed integration.
///
/// Mirrors the JavaScript SDK's `registerDomainNameV2` function exactly.
Future<List<TransactionInstruction>> registerDomainNameV2(
  SnsClient connection,
  String name,
  int space,
  solana.Ed25519HDPublicKey buyer,
  solana.Ed25519HDPublicKey buyerTokenAccount,
  solana.Ed25519HDPublicKey mint, {
  solana.Ed25519HDPublicKey? referrerKey,
}) async {
  // 1. Validation (exact match with JS SDK)
  if (name.contains('.') ||
      name.trim().toLowerCase() != name ||
      name.trim() != name) {
    throw InvalidDomainError('The domain name is malformed');
  }

  final instructions = <TransactionInstruction>[];

  // 2. Account derivations (use existing utilities)
  final hashed = getHashedNameSync(name);
  final nameAccount = await getNameAccountKeySync(
    hashed,
    nameParent: rootDomainAddress,
  );

  final hashedReverseLookup = getHashedNameSync(nameAccount);
  final reverseLookupAccount = getNameAccountKeySync(
    hashedReverseLookup,
    nameParent: centralState,
  );

  // 3. PDA derivation (use existing Solana package)
  final nameAccountKey = solana.Ed25519HDPublicKey.fromBase58(nameAccount);
  final derivedState = await solana.Ed25519HDPublicKey.findProgramAddress(
    seeds: [nameAccountKey.bytes],
    programId: solana.Ed25519HDPublicKey.fromBase58(registryProgramAddress),
  );

  // 4. Referrer logic (use existing constants)
  var refIdx = -1;
  solana.Ed25519HDPublicKey? refTokenAccount;

  if (referrerKey != null) {
    final referrerAddress = referrerKey.toBase58();
    refIdx = referrers.indexOf(referrerAddress);

    if (refIdx != -1) {
      // Find associated token address for referrer
      refTokenAccount = await solana.findAssociatedTokenAddress(
        owner: referrerKey,
        mint: mint,
      );

      // Create ATA instruction if needed
      final ataIx = await createAssociatedTokenAccountIdempotent(
        connection,
        buyer,
        refTokenAccount,
        referrerKey,
        mint,
      );

      if (ataIx != null) {
        instructions.add(ataIx);
      }
    }
  }

  // 5. Token vault and Pyth feed
  final vault = await solana.findAssociatedTokenAddress(
    owner: solana.Ed25519HDPublicKey.fromBase58(vaultOwner),
    mint: mint,
  );

  final pythFeed = pythPullFeeds[mint.toBase58()];
  if (pythFeed == null) {
    throw PythFeedNotFoundError(
        'Pyth feed for mint ${mint.toBase58()} not found');
  }

  final pythFeedAccount = await getPythFeedAccountKey(0, pythFeed);

  // 6. Create instruction (use existing CreateSplitV2Instruction)
  final params = CreateSplitV2InstructionParams(
    name: name,
    space: space,
    referrerIdxOpt: refIdx != -1 ? refIdx : null,
    programAddress: registryProgramAddress,
    namingServiceProgram: nameProgramAddress,
    rootDomain: rootDomainAddress,
    nameAddress: nameAccount,
    reverseLookup: await reverseLookupAccount,
    systemProgram: systemProgramAddress,
    centralState: centralState,
    buyer: buyer.toBase58(),
    domainOwner: buyer.toBase58(),
    feePayer: buyer.toBase58(),
    buyerTokenSource: buyerTokenAccount.toBase58(),
    pythFeedAccount: pythFeedAccount.toBase58(),
    vault: vault.toBase58(),
    splTokenProgram: tokenProgramAddress,
    rentSysvar: sysvarRentAddress,
    state: derivedState.toBase58(),
    referrerAccountOpt: refTokenAccount?.toBase58(),
  );

  final splitIx = CreateSplitV2Instruction(
    name: name,
    space: space,
    referrerIdxOpt: refIdx != -1 ? refIdx : null,
    params: params,
  );

  final splitInstruction = splitIx.build();
  instructions.add(splitInstruction);
  return instructions;
}
