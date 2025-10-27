/// RPC client interface for Solana blockchain interaction in SNS operations.
///
/// Defines the contract for blockchain communication required by the SNS SDK.
/// Implementations handle network requests, error handling, and data formatting.
/// The SDK provides a default HTTP implementation but allows custom clients.
abstract class RpcClient {
  /// Fetches encoded account information from the blockchain.
  ///
  /// Retrieves account data for a single Solana account address.
  /// Used internally for domain registry, NFT, and record account lookups.
  ///
  /// [address] The base58-encoded account address to fetch
  ///
  /// Returns [AccountInfo] containing the account data and metadata
  Future<AccountInfo> fetchEncodedAccount(String address);

  /// Fetches multiple encoded accounts in a single batch request.
  ///
  /// Optimizes network usage by retrieving multiple accounts simultaneously.
  /// Essential for operations that need to check domain, NFT, and record
  /// accounts together for atomic validation.
  ///
  /// [addresses] List of base58-encoded account addresses to fetch
  ///
  /// Returns list of [AccountInfo] objects in the same order as requested
  Future<List<AccountInfo>> fetchEncodedAccounts(List<String> addresses);

  /// Gets the largest token accounts for a specific mint.
  ///
  /// Used for NFT ownership verification and token holder lookups.
  /// Returns accounts sorted by token balance in descending order.
  ///
  /// [mint] The base58-encoded token mint address
  ///
  /// Returns list of [TokenAccountValue] objects with account and balance info
  Future<List<TokenAccountValue>> getTokenLargestAccounts(String mint);

  /// Gets program accounts matching specific filters.
  ///
  /// Powerful query method for finding accounts owned by specific programs.
  /// Used for domain enumeration, subdomain discovery, and bulk operations.
  ///
  /// [programId] The base58-encoded program ID to query
  /// [encoding] The encoding format for returned data ('base58', 'base64', etc.)
  /// [filters] List of filters to apply (memcmp, dataSize, etc.)
  /// [dataSlice] Optional parameters to limit returned data size
  /// [limit] Optional maximum number of accounts to return
  /// @returns List of matching ProgramAccount objects
  Future<List<ProgramAccount>> getProgramAccounts(
    String programId, {
    required String encoding,
    required List<AccountFilter> filters,
    DataSlice? dataSlice,
    int? limit,
  });
}

/// Account information returned from RPC calls.
///
/// Contains the account existence status and binary data.
class AccountInfo {
  const AccountInfo({
    required this.exists,
    required this.data,
  });

  /// Whether the account exists
  final bool exists;

  /// Account data as bytes
  final List<int> data;
}

/// Token account value representing a token holding.
///
/// Contains the account address and token amount.
class TokenAccountValue {
  const TokenAccountValue({
    required this.address,
    required this.amount,
  });

  /// Token account address
  final String address;

  /// Token amount
  final String amount;
}

/// Program account result from getProgramAccounts RPC call.
///
/// Contains the account address and associated data.
class ProgramAccount {
  const ProgramAccount({
    required this.pubkey,
    required this.account,
  });

  /// Account public key
  final String pubkey;

  /// Account information
  final AccountInfo account;
}

/// Account filter for getProgramAccounts
abstract class AccountFilter {
  const AccountFilter();
}

/// Memory comparison filter
class MemcmpFilter extends AccountFilter {
  const MemcmpFilter({
    required this.offset,
    required this.bytes,
    required this.encoding,
  });

  /// Byte offset to start comparison
  final int offset;

  /// Bytes to compare (base58 encoded)
  final String bytes;

  /// Encoding type
  final String encoding;
}

/// Data size filter
class DataSizeFilter extends AccountFilter {
  const DataSizeFilter({
    required this.size,
  });

  /// Expected data size in bytes
  final int size;
}

/// Data slice for limiting returned data
class DataSlice {
  const DataSlice({
    required this.offset,
    required this.length,
  });

  /// Byte offset to start slice
  final int offset;

  /// Number of bytes to return
  final int length;
}
