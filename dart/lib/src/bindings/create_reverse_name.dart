/// Create reverse name binding for SNS domains
///
/// This function creates reverse lookup entries for domains, mirroring
/// js/src/bindings/createReverseName.ts functionality exactly.
library;

import 'package:solana/solana.dart';
import '../constants/addresses.dart';
import '../instructions/create_reverse_instruction.dart';
import '../instructions/instruction_types.dart';
import '../utils/get_domain_key_sync.dart';

/// Parameters for creating a reverse name entry
class CreateReverseNameParams {
  const CreateReverseNameParams({
    required this.nameAccount,
    required this.name,
    required this.feePayer,
    this.parentName,
    this.parentNameOwner,
  });

  /// The name account to create the reverse account for
  final Ed25519HDPublicKey nameAccount;

  /// The name of the domain
  final String name;

  /// The fee payer of the transaction
  final Ed25519HDPublicKey feePayer;

  /// Optional parent name account
  final Ed25519HDPublicKey? parentName;

  /// Optional parent name owner
  final Ed25519HDPublicKey? parentNameOwner;
}

/// Creates reverse lookup entries for domains
///
/// This function mirrors js/src/bindings/createReverseName.ts exactly:
/// - Creates hashed reverse lookup from name account
/// - Derives reverse lookup account using CENTRAL_STATE
/// - Builds create reverse instruction with proper accounts
///
/// Returns list of transaction instructions for reverse name creation.
Future<List<TransactionInstruction>> createReverseName(
  CreateReverseNameParams params,
) async {
  // Create hashed reverse lookup from name account (matches JS logic)
  final hashedReverseLookup = getHashedNameSync(params.nameAccount.toBase58());

  // Derive reverse lookup account using centralState as parent
  final reverseLookupAccount = getNameAccountKeySync(
    hashedReverseLookup,
    nameClass: centralState,
    nameParent: params.parentName?.toBase58(),
  );

  // Create the reverse instruction parameters
  final instructionParams = CreateReverseInstructionParams(
    domain: params.name,
    programAddress: registryProgramAddress,
    namingServiceProgram: nameProgramAddress,
    rootDomain: rootDomainAddress,
    reverseLookup: await reverseLookupAccount,
    systemProgram: systemProgramAddress,
    centralState: centralState,
    payer: params.feePayer.toBase58(),
    rentSysvar: sysvarRentAddress,
    parentAddress: params.parentName?.toBase58(),
    parentOwner: params.parentNameOwner?.toBase58(),
  );

  // Create the reverse instruction
  final createReverseInstr = CreateReverseInstruction(
    domain: params.name,
    params: instructionParams,
  );

  // Build and return the instruction
  final instruction = createReverseInstr.build();

  return [instruction];
}
