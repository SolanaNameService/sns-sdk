import 'package:solana/solana.dart';

/// Interface for account keys in instructions
///
/// This interface mirrors js/src/instructions/types.ts with strict parity
class AccountKey {
  const AccountKey({
    required this.pubkey,
    required this.isSigner,
    required this.isWritable,
  });

  /// The public key of the account
  final Ed25519HDPublicKey pubkey;

  /// Whether this account is a signer
  final bool isSigner;

  /// Whether this account is writable
  final bool isWritable;

  @override
  String toString() =>
      'AccountKey(pubkey: $pubkey, isSigner: $isSigner, isWritable: $isWritable)';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AccountKey &&
          runtimeType == other.runtimeType &&
          pubkey == other.pubkey &&
          isSigner == other.isSigner &&
          isWritable == other.isWritable;

  @override
  int get hashCode => pubkey.hashCode ^ isSigner.hashCode ^ isWritable.hashCode;
}
