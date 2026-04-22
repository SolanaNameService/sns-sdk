import 'dart:typed_data';
import 'package:solana/solana.dart' hide RpcClient;

import '../../sns_sdk.dart';
import '../utils/get_pyth_feed_address.dart';

/// Error thrown when domain is invalid
class InvalidDomainError extends Error {
  InvalidDomainError(this.message);

  final String message;

  @override
  String toString() => 'InvalidDomainError: $message';
}

/// Error thrown when Pyth feed is not found
class PythFeedNotFoundError extends Error {
  PythFeedNotFoundError(this.message);

  final String message;

  @override
  String toString() => 'PythFeedNotFoundError: $message';
}

/// Parameters for registering a domain
class RegisterDomainParams {
  const RegisterDomainParams({
    required this.rpc,
    required this.domain,
    required this.space,
    required this.buyer,
    required this.buyerTokenAccount,
    this.mint,
    this.referrer,
  });

  /// RPC client for blockchain operations
  final RpcClient rpc;

  /// Domain name to register
  final String domain;

  /// Space in bytes to allocate
  final int space;

  /// Buyer address
  final String buyer;

  /// Buyer token account address
  final String buyerTokenAccount;

  /// Token mint for payment (defaults to USDC)
  final String? mint;

  /// Optional referrer address
  final String? referrer;
}

/// Registers a .sol domain
///
/// Creates the necessary instructions for registering a domain on Solana Name Service
///
/// @param params Registration parameters
/// @returns A list of transaction instructions to be included in a transaction
Future<List<TransactionInstruction>> registerDomain(
    RegisterDomainParams params) async {
  final mint = params.mint ?? usdcMint;

  // Basic validation
  if (params.domain.isEmpty) {
    throw InvalidDomainError('The domain name cannot be empty');
  }

  if (params.domain.contains('.') ||
      params.domain.trim().toLowerCase() != params.domain) {
    throw InvalidDomainError('The domain name is malformed');
  }

  if (params.space <= 0) {
    throw InvalidDomainError('Space must be a positive integer');
  }

  final domainAddress =
      await deriveAddress(params.domain, parentAddress: rootDomainAddress);

  final reverseLookupAccount = await deriveAddress(
    domainAddress,
    classAddress: centralState,
  );

  // Generate state PDA
  final stateAddress = await _getProgramDerivedAddress(
    seeds: [_base58Decode(domainAddress)],
    programId: registryProgramAddress,
  );

  final instructions = <TransactionInstruction>[];
  final referrerIndex = referrers.indexOf(params.referrer ?? '');
  final validReferrer = params.referrer != null && referrerIndex != -1;
  String? ata;

  if (validReferrer) {
    ata = await _findAssociatedTokenAddress(
      mint: mint,
      owner: params.referrer!,
    );

    final ataAccount = await params.rpc.fetchEncodedAccount(ata);

    if (!ataAccount.exists) {
      final createAtaIx = await _createAtaInstruction(
        buyer: params.buyer,
        ata: ata,
        owner: params.referrer!,
        mint: mint,
      );
      instructions.add(createAtaIx);
    }
  }

  final vaultAta = await _findAssociatedTokenAddress(
    mint: mint,
    owner: vaultOwner,
  );

  final priceFeed = pythFeeds[mint];
  if (priceFeed == null) {
    throw PythFeedNotFoundError(
        'The Pyth account for the provided mint was not found');
  }

  final pythFeedAddress = await getPythFeedAddress(GetPythFeedAddressParams(
    shard: 0,
    priceFeed: _base58Decode(priceFeed),
  ));

  final createSplitIx = CreateSplitV2Instruction(
    name: params.domain,
    space: params.space,
    referrerIdxOpt: validReferrer ? referrerIndex : null,
    params: CreateSplitV2InstructionParams(
      name: params.domain,
      space: params.space,
      referrerIdxOpt: validReferrer ? referrerIndex : null,
      programAddress: registryProgramAddress,
      namingServiceProgram: nameProgramAddress,
      rootDomain: rootDomainAddress,
      nameAddress: domainAddress,
      reverseLookup: reverseLookupAccount,
      systemProgram: systemProgramAddress,
      centralState: centralState,
      buyer: params.buyer,
      domainOwner: params.buyer,
      feePayer: params.buyer,
      buyerTokenSource: params.buyerTokenAccount,
      pythFeedAccount: pythFeedAddress,
      vault: vaultAta,
      splTokenProgram: tokenProgramAddress,
      rentSysvar: sysvarRentAddress,
      state: stateAddress,
      referrerAccountOpt: ata,
    ),
  );

  instructions.add(createSplitIx.build());

  return instructions;
}

/// Creates an ATA instruction using proper Solana Associated Token Account format
Future<TransactionInstruction> _createAtaInstruction({
  required String buyer,
  required String ata,
  required String owner,
  required String mint,
}) async {
  // Use proper ATA creation instruction format matching Solana standards
  return TransactionInstruction(
    programAddress: associatedTokenProgramAddress,
    accounts: [
      AccountMeta(address: buyer, role: AccountRole.writableSigner),
      AccountMeta(address: ata, role: AccountRole.writable),
      AccountMeta(address: owner, role: AccountRole.readonly),
      AccountMeta(address: mint, role: AccountRole.readonly),
      const AccountMeta(
          address: systemProgramAddress, role: AccountRole.readonly),
      const AccountMeta(
          address: tokenProgramAddress, role: AccountRole.readonly),
      const AccountMeta(address: sysvarRentAddress, role: AccountRole.readonly),
    ],
    data: Uint8List.fromList([]), // ATA creation uses empty data
  );
}

/// Finds associated token address using proper PDA derivation
Future<String> _findAssociatedTokenAddress({
  required String mint,
  required String owner,
}) async {
  // Use proper ATA PDA derivation matching espresso-cash-public pattern
  final result = await Ed25519HDPublicKey.findProgramAddress(
    seeds: [
      _base58Decode(owner),
      _base58Decode(tokenProgramAddress),
      _base58Decode(mint),
    ],
    programId: Ed25519HDPublicKey.fromBase58(associatedTokenProgramAddress),
  );

  return result.toBase58();
}

/// Generates a Program Derived Address (PDA)
Future<String> _getProgramDerivedAddress({
  required List<List<int>> seeds,
  required String programId,
}) async {
  final programIdBytes = _base58Decode(programId);

  // Try different bump seeds starting from 255
  for (var bump = 255; bump >= 0; bump--) {
    final seedsWithBump = List<List<int>>.from(seeds)..add([bump]);

    final candidate = await _createProgramAddress(
      seeds: seedsWithBump,
      programId: programIdBytes,
    );

    if (candidate != null) {
      return candidate;
    }
  }

  throw StateError('Unable to find a valid program derived address');
}

/// Creates a program address from seeds and program ID
Future<String?> _createProgramAddress({
  required List<List<int>> seeds,
  required List<int> programId,
}) async {
  const maxSeedLength = 32;

  // Validate seed lengths
  for (final seed in seeds) {
    if (seed.length > maxSeedLength) {
      throw ArgumentError('Seed too long: ${seed.length} > $maxSeedLength');
    }
  }

  // Create the data to hash
  final data = <int>[];

  // Add all seeds
  seeds.forEach(data.addAll);

  // Add program ID and PDA marker
  data
    ..addAll(programId)
    ..addAll('ProgramDerivedAddress'.codeUnits);

  // Hash the data using derive_address utility
  final hash = await generateHash(String.fromCharCodes(data));

  // Check if the hash is on the ed25519 curve
  if (_isOnCurve(hash)) {
    return null; // Invalid PDA, try next bump
  }

  return _base58Encode(hash);
}

/// Checks if a point is on the ed25519 curve
bool _isOnCurve(Uint8List bytes) {
  if (bytes.length != 32) {
    return false;
  }

  final lastByte = bytes[31];
  return (lastByte & 0x80) != 0 && lastByte >= 0xED;
}

/// Base58 alphabet
const String _base58Alphabet =
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/// Decodes a base58 string to bytes
List<int> _base58Decode(String input) {
  if (input.isEmpty) {
    return [];
  }

  var leadingZeros = 0;
  for (var i = 0; i < input.length; i++) {
    if (input[i] == '1') {
      leadingZeros++;
    } else {
      break;
    }
  }

  var decoded = BigInt.zero;
  final base = BigInt.from(58);

  for (var i = leadingZeros; i < input.length; i++) {
    final char = input[i];
    final index = _base58Alphabet.indexOf(char);
    if (index == -1) {
      throw ArgumentError('Invalid base58 character: $char');
    }
    decoded = decoded * base + BigInt.from(index);
  }

  final bytes = <int>[];
  while (decoded > BigInt.zero) {
    bytes.insert(0, (decoded % BigInt.from(256)).toInt());
    decoded = decoded ~/ BigInt.from(256);
  }

  for (var i = 0; i < leadingZeros; i++) {
    bytes.insert(0, 0);
  }

  return bytes;
}

/// Encodes bytes to a base58 string
String _base58Encode(Uint8List input) {
  if (input.isEmpty) {
    return '';
  }

  var leadingZeros = 0;
  for (var i = 0; i < input.length; i++) {
    if (input[i] == 0) {
      leadingZeros++;
    } else {
      break;
    }
  }

  var value = BigInt.zero;
  for (final byte in input) {
    value = value * BigInt.from(256) + BigInt.from(byte);
  }

  final result = <String>[];
  final base = BigInt.from(58);

  while (value > BigInt.zero) {
    final remainder = (value % base).toInt();
    result.insert(0, _base58Alphabet[remainder]);
    value = value ~/ base;
  }

  for (var i = 0; i < leadingZeros; i++) {
    result.insert(0, '1');
  }

  return result.join();
}
