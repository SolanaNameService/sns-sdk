import 'dart:typed_data';
import 'package:solana/solana.dart' as solana;
import 'package:solana/src/encoder/account_meta.dart' as solana_account;
import '../client/sns_client.dart';
import '../instructions/instruction_types.dart';

/// Creates an Associated Token Account (ATA) if it doesn't already exist.
///
/// This function checks if the ATA already exists and only creates the instruction
/// if the account is not found. This mirrors the JavaScript SDK's
/// `createAssociatedTokenAccountIdempotentInstruction` functionality.
///
/// Returns `null` if the account already exists, otherwise returns the instruction
/// to create the ATA.
Future<TransactionInstruction?> createAssociatedTokenAccountIdempotent(
  SnsClient connection,
  solana.Ed25519HDPublicKey payer,
  solana.Ed25519HDPublicKey associatedToken,
  solana.Ed25519HDPublicKey owner,
  solana.Ed25519HDPublicKey mint,
) async {
  try {
    // Check if ATA already exists
    final accountInfo =
        await connection.getAccountInfo(associatedToken.toBase58());

    // If account exists and has data, it's already created
    if (accountInfo.data.isNotEmpty) {
      return null;
    }
  } on Exception {
    // Account doesn't exist, we need to create it
  }

  // Create the ATA instruction using the Solana package
  final ataInstruction = solana.AssociatedTokenAccountInstruction.createAccount(
    funder: payer,
    address: associatedToken,
    owner: owner,
    mint: mint,
  );

  // Convert to our TransactionInstruction format
  return TransactionInstruction(
    programAddress: ataInstruction.programId.toBase58(),
    accounts: ataInstruction.accounts
        .map((account) => AccountMeta(
              address: account.pubKey.toBase58(),
              role: _convertAccountRole(account),
            ))
        .toList(),
    data: Uint8List.fromList(ataInstruction.data.toList()),
  );
}

/// Convert Solana package AccountMeta to our AccountRole
AccountRole _convertAccountRole(solana_account.AccountMeta solanaAccount) {
  if (solanaAccount.isSigner && solanaAccount.isWriteable) {
    return AccountRole.writableSigner;
  } else if (solanaAccount.isSigner) {
    return AccountRole.readonlySigner;
  } else if (solanaAccount.isWriteable) {
    return AccountRole.writable;
  } else {
    return AccountRole.readonly;
  }
}
