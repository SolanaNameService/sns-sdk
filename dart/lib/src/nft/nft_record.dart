import 'dart:typed_data';
import 'package:solana/solana.dart' as solana;
import '../utils/base58_utils.dart';

/// NFT Record tags following JavaScript SDK
enum NftRecordTag {
  uninitialized,
  centralState,
  activeRecord,
  inactiveRecord;

  static NftRecordTag fromInt(int value) {
    switch (value) {
      case 0:
        return NftRecordTag.uninitialized;
      case 1:
        return NftRecordTag.centralState;
      case 2:
        return NftRecordTag.activeRecord;
      case 3:
        return NftRecordTag.inactiveRecord;
      default:
        throw ArgumentError('Invalid NFT record tag: $value');
    }
  }

  int get value {
    switch (this) {
      case NftRecordTag.uninitialized:
        return 0;
      case NftRecordTag.centralState:
        return 1;
      case NftRecordTag.activeRecord:
        return 2;
      case NftRecordTag.inactiveRecord:
        return 3;
    }
  }
}

/// NFT Record state following JavaScript SDK structure
class NftRecord {
  const NftRecord({
    required this.tag,
    required this.nonce,
    required this.nameAccount,
    required this.owner,
    required this.nftMint,
  });
  final NftRecordTag tag;
  final int nonce;
  final solana.Ed25519HDPublicKey nameAccount;
  final solana.Ed25519HDPublicKey owner;
  final solana.Ed25519HDPublicKey nftMint;

  /// Find the NFT record key synchronously
  static Future<solana.Ed25519HDPublicKey> findKeySync(
    solana.Ed25519HDPublicKey domainKey,
    solana.Ed25519HDPublicKey programId,
  ) async {
    final seeds = [
      'nft_record'.codeUnits,
      domainKey.bytes,
    ];

    final result = await solana.Ed25519HDPublicKey.findProgramAddress(
      seeds: seeds,
      programId: programId,
    );

    return result;
  }

  /// Deserialize NFT record from account data
  static NftRecord deserialize(Uint8List data) {
    if (data.length < 98) {
      // 1 + 1 + 32 + 32 + 32 = 98 bytes
      throw ArgumentError('NFT record data too short');
    }

    final tag = NftRecordTag.fromInt(data[0]);
    final nonce = data[1];

    // Extract field bytes according to JS schema: tag(1) + nonce(1) + nameAccount(32) + owner(32) + nftMint(32)
    final nameAccountBytes = data.sublist(2, 34);
    final ownerBytes = data.sublist(34, 66);
    final nftMintBytes = data.sublist(66, 98);

    final nameAccount = solana.Ed25519HDPublicKey.fromBase58(
      Base58Utils.encode(nameAccountBytes),
    );
    final owner = solana.Ed25519HDPublicKey.fromBase58(
      Base58Utils.encode(ownerBytes),
    );
    final nftMint = solana.Ed25519HDPublicKey.fromBase58(
      Base58Utils.encode(nftMintBytes),
    );

    return NftRecord(
      tag: tag,
      nonce: nonce,
      nameAccount: nameAccount,
      owner: owner,
      nftMint: nftMint,
    );
  }
}
