import 'package:solana/solana.dart';

import '../constants/addresses.dart';
import '../errors/sns_errors.dart';
import '../instructions/create_instruction_v3.dart';
import '../instructions/instruction_types.dart';
import '../utils/create_associated_token_account.dart';
import '../utils/get_domain_key_sync.dart';
import '../utils/get_reverse_key_sync.dart';

/// Parameters for registerDomainName function
class RegisterDomainNameParams {
  const RegisterDomainNameParams({
    required this.name,
    required this.space,
    required this.buyer,
    required this.buyerTokenAccount,
    this.mint,
    this.referrerKey,
  });
  final String name;
  final int space;
  final Ed25519HDPublicKey buyer;
  final Ed25519HDPublicKey buyerTokenAccount;
  final Ed25519HDPublicKey? mint;
  final Ed25519HDPublicKey? referrerKey;
}

/// Register a .sol domain (deprecated, use registerDomainNameV2)
///
/// This function mirrors js/src/bindings/registerDomainName.ts exactly.
/// Creates all necessary instructions for domain registration including
/// ATA creation for referrers and proper Pyth feed integration.
///
/// @deprecated This function is deprecated and will be removed in future releases.
/// Use registerDomainNameV2 instead.
///
/// [connection] - The Solana RPC connection object
/// [params] - Registration parameters
///
/// Returns a list of transaction instructions
///
/// Throws [InvalidDomainError] if domain name is malformed
/// Throws [PythFeedNotFoundError] if Pyth feed for mint is not found
Future<List<TransactionInstruction>> registerDomainName(
  dynamic connection, // SnsClient or similar
  RegisterDomainNameParams params,
) async {
  final mint = params.mint ?? Ed25519HDPublicKey.fromBase58(usdcMint);

  // Basic validation - exact match to JS implementation
  if (params.name.contains('.') ||
      params.name.trim().toLowerCase() != params.name) {
    throw SnsError(ErrorType.invalidDomain, 'The domain name is malformed');
  }

  // Get domain account key
  final domainResult = await getDomainKeySync(params.name);
  final nameAccount = Ed25519HDPublicKey.fromBase58(domainResult.pubkey);

  // Create reverse lookup account - get by name then convert to domain key
  final reverseLookupAccount = await getReverseKeySync(params.name);

  // Generate derived state PDA
  final derivedState = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [nameAccount.bytes],
    programId: Ed25519HDPublicKey.fromBase58(registryProgramAddress),
  );

  // Check for referrer
  var refIdx = -1;
  if (params.referrerKey != null) {
    refIdx = referrers.indexWhere(
        (ref) => Ed25519HDPublicKey.fromBase58(ref) == params.referrerKey);
  }

  final instructions = <TransactionInstruction>[];
  Ed25519HDPublicKey? refTokenAccount;

  // Create ATA for referrer if needed
  if (refIdx != -1 && params.referrerKey != null) {
    refTokenAccount = await findAssociatedTokenAddress(
      owner: params.referrerKey!,
      mint: mint,
    );

    // Create ATA instruction if needed
    final ataIx = await createAssociatedTokenAccountIdempotent(
      connection,
      params.buyer,
      refTokenAccount,
      params.referrerKey!,
      mint,
    );

    if (ataIx != null) {
      instructions.add(ataIx);
    }
  }

  // Get vault ATA
  final vault = await findAssociatedTokenAddress(
    owner: Ed25519HDPublicKey.fromBase58(vaultOwner),
    mint: mint,
  );

  // Get Pyth feed - this should match JS PYTH_FEEDS logic
  final pythFeedMap = <String, Map<String, String>>{
    usdcMint: {
      'product': 'BjUgj6YCnFBZ49wF54ddCg16JHyJh9R367VybctPyxTQ',
      'price': 'Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD',
    },
    // Add other mint feeds as needed
  };

  final pythFeed = pythFeedMap[mint.toBase58()];
  if (pythFeed == null) {
    throw SnsError(
      ErrorType.pythFeedNotFound,
      'The Pyth account for the provided mint was not found',
    );
  }

  // Create the main registration instruction using CreateInstructionV3
  final instructionParams = CreateInstructionV3Params(
    name: params.name,
    space: params.space,
    referrerIdxOpt: refIdx != -1 ? refIdx : null,
    programAddress: registryProgramAddress,
    namingServiceProgram: nameProgramAddress,
    rootDomain: rootDomainAddress,
    nameAddress: nameAccount.toBase58(),
    reverseLookup: reverseLookupAccount.toBase58(),
    systemProgram: systemProgramAddress,
    centralState: centralState,
    buyer: params.buyer.toBase58(),
    buyerTokenSource: params.buyerTokenAccount.toBase58(),
    pythMappingAcc: 'AHtgzX45WTKfkPG53L6WYhGEXwQkN1BVknET3sVsLL8J',
    pythProductAcc: pythFeed['product']!,
    pythPriceAcc: pythFeed['price']!,
    vault: vault.toBase58(),
    splTokenProgram: tokenProgramAddress,
    rentSysvar: sysvarRentAddress,
    state: derivedState.toBase58(),
    referrerAccountOpt: refTokenAccount?.toBase58(),
  );

  final createIx = CreateInstructionV3(
    name: params.name,
    space: params.space,
    referrerIdxOpt: refIdx != -1 ? refIdx : null,
    params: instructionParams,
  );

  final registrationIx = createIx.build();
  instructions.add(registrationIx);

  return instructions;
}
