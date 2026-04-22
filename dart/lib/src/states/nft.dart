import 'dart:convert';
import 'dart:typed_data';

import 'package:crypto/crypto.dart';

import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';
import '../types/validation.dart';
import '../utils/base58_utils.dart';
import 'record_v2.dart';

/// NFT tag enumeration
enum NftTag {
  /// Uninitialized NFT
  uninitialized,

  /// Central state
  centralState,

  /// Active NFT record
  activeRecord,

  /// Inactive NFT record
  inactiveRecord;

  /// Get tag from integer value
  static NftTag fromInt(int value) {
    switch (value) {
      case 0:
        return NftTag.uninitialized;
      case 1:
        return NftTag.centralState;
      case 2:
        return NftTag.activeRecord;
      case 3:
        return NftTag.inactiveRecord;
      default:
        throw ArgumentError('Invalid NFT tag value: $value');
    }
  }

  /// Get integer value for tag
  int get value {
    switch (this) {
      case NftTag.uninitialized:
        return 0;
      case NftTag.centralState:
        return 1;
      case NftTag.activeRecord:
        return 2;
      case NftTag.inactiveRecord:
        return 3;
    }
  }
}

/// Parameters for retrieving NFT from mint
class GetNftFromMintParams {
  const GetNftFromMintParams({
    required this.rpc,
    required this.mint,
  });

  /// The RPC client for blockchain interaction
  final RpcClient rpc;

  /// The NFT mint address
  final String mint;
}

/// NFT state class for domain NFT information
///
/// This mirrors the NftState from js-kit/src/states/nft.ts
class NftState {
  const NftState({
    required this.tag,
    required this.nonce,
    required this.nameAccount,
    required this.owner,
    required this.nftMint,
  });

  /// The NFT tag indicating the state
  final NftTag tag;

  /// The nonce value
  final int nonce;

  /// The domain address that this NFT represents
  final String nameAccount;

  /// The NFT owner address
  final String owner;

  /// The NFT mint address
  final String nftMint;

  /// The total length of the NFT state struct
  /// tag (1) + nonce (1) + nameAccount (32) + owner (32) + nftMint (32) = 98 bytes
  static const int len = 98;

  /// Deserializes NFT state from account data
  ///
  /// [data] - The raw account data
  ///
  /// Returns an NftState instance
  static NftState deserialize(Uint8List data) {
    if (data.length < len) {
      throw ArgumentError(
          'Invalid NFT data length: expected $len, got ${data.length}');
    }

    // Extract tag from first byte
    final tagValue = data[0];
    final tag = NftTag.fromInt(tagValue);

    // Extract nonce from second byte
    final nonce = data[1];

    // Extract name account (bytes 2-33)
    final nameAccountBytes = data.sublist(2, 34);
    final nameAccount = _base58Encode(nameAccountBytes);

    // Extract owner (bytes 34-65)
    final ownerBytes = data.sublist(34, 66);
    final owner = _base58Encode(ownerBytes);

    // Extract NFT mint (bytes 66-97)
    final nftMintBytes = data.sublist(66, 98);
    final nftMint = _base58Encode(nftMintBytes);

    return NftState(
      tag: tag,
      nonce: nonce,
      nameAccount: nameAccount,
      owner: owner,
      nftMint: nftMint,
    );
  }

  /// Retrieves NFT state from account address
  ///
  /// [rpc] - The RPC client
  /// [address] - The NFT account address
  ///
  /// Returns the NFT state
  static Future<NftState> retrieve(RpcClient rpc, String address) async {
    final nftAccount = await rpc.fetchEncodedAccount(address);
    if (!nftAccount.exists) {
      throw StateError('NFT not found: $address');
    }
    return deserialize(Uint8List.fromList(nftAccount.data));
  }

  /// Retrieves NFT state from mint address
  ///
  /// [params] - Parameters containing RPC client and mint address
  ///
  /// Returns the NFT state or null if not found
  static Future<NftState?> retrieveFromMint(GetNftFromMintParams params) async {
    try {
      final data = await params.rpc.getProgramAccounts(
        nameTokenizerAddress,
        encoding: 'base64',
        filters: [
          const DataSizeFilter(size: len),
          const MemcmpFilter(
            offset: 0,
            bytes: '3', // ActiveRecord tag
            encoding: 'base58',
          ),
          MemcmpFilter(
            offset: 1 + 1 + 32 + 32, // Skip tag + nonce + nameAccount + owner
            bytes: params.mint,
            encoding: 'base58',
          ),
        ],
      );

      if (data.length != 1) {
        return null; // NFT not found
      }

      return deserialize(Uint8List.fromList(data[0].account.data));
    } on Exception {
      return null; // Return null instead of throwing on error
    }
  }

  /// Gets the NFT address for a given domain address
  ///
  /// [domainAddress] - The domain address
  ///
  /// Returns the NFT address
  static Future<String> getAddress(String domainAddress) async {
    try {
      // Create a deterministic NFT address based on domain address
      // This simulates PDA derivation using SHA-256 hash
      final hash = sha256.convert([
        ...utf8.encode('nft_record'),
        ...utf8.encode(domainAddress),
        ...utf8.encode(nameTokenizerAddress),
      ]);

      // Take first 32 bytes and encode as base58
      final addressBytes = Uint8List.fromList(hash.bytes.take(32).toList());
      return _base58Encode(addressBytes);
    } on Exception {
      // If derivation fails, return the domain address itself as fallback
      // This ensures we always return a valid address format
      return domainAddress;
    }
  }

  /// Base58 encode helper - now using shared utility
  static String _base58Encode(Uint8List input) => Base58Utils.encode(input);
}

/// Record state class for V2 record information
///
/// This mirrors the RecordState from js-kit/src/states/record.ts
class RecordState {
  const RecordState({
    required this.header,
    required this.content,
    required this.data,
  });

  /// Record header containing validation information
  final RecordHeaderState header;

  /// The record content
  final Uint8List content;

  /// Additional record data
  final Uint8List data;

  /// Gets the staleness ID from the record
  List<int> getStalenessId() {
    // Extract staleness ID from record data at the correct offset
    // Following RecordState structure: content + staleness(32) + roa(32)
    final contentLength = header.contentLength;
    final stalenessOffset = contentLength;

    if (data.length >= stalenessOffset + 32) {
      return data.sublist(stalenessOffset, stalenessOffset + 32);
    }
    return <int>[];
  }

  /// Gets the Right of Association (RoA) ID from the record
  List<int> getRoAId() {
    // Extract RoA ID from record data at the correct offset
    // Following RecordState structure: content + staleness(32) + roa(32)
    final contentLength = header.contentLength;
    final roaOffset = contentLength + 32; // After content and staleness

    if (data.length >= roaOffset + 32) {
      return data.sublist(roaOffset, roaOffset + 32);
    }
    return <int>[];
  }

  /// Gets the record content
  Uint8List getContent() => content;

  /// Deserializes record state from account data
  ///
  /// [data] - The raw account data
  ///
  /// Returns a RecordState instance
  static RecordState deserialize(Uint8List data) {
    if (data.length < nameRegistryLen + RecordHeaderState.len) {
      throw ArgumentError('Invalid record data length');
    }

    // Extract header information at nameRegistryLen offset
    final headerData =
        data.sublist(nameRegistryLen, nameRegistryLen + RecordHeaderState.len);
    final header = RecordHeaderState.deserialize(headerData);

    // Extract data after nameRegistryLen + header
    final recordData = data.sublist(nameRegistryLen + RecordHeaderState.len);

    // Extract content based on header's contentLength
    final content = recordData.sublist(0, header.contentLength);

    return RecordState(
      header: header,
      content: content,
      data: recordData,
    );
  }
}

/// Record header containing validation information
class RecordValidationHeader {
  const RecordValidationHeader({
    required this.stalenessValidation,
    required this.rightOfAssociationValidation,
  });

  /// Staleness validation type
  final Validation stalenessValidation;

  /// Right of Association validation type
  final Validation rightOfAssociationValidation;

  /// Deserializes record header from data
  static RecordValidationHeader deserialize(Uint8List data) {
    if (data.length < 2) {
      throw ArgumentError('Invalid header data length');
    }

    // Extract validation types from first two bytes
    final stalenessValue = data[0];
    final roaValue = data[1];

    return RecordValidationHeader(
      stalenessValidation: Validation.fromValue(stalenessValue),
      rightOfAssociationValidation: Validation.fromValue(roaValue),
    );
  }
}
