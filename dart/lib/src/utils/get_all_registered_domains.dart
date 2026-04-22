import '../constants/addresses.dart';
import '../rpc/rpc_client.dart';

/// Gets all registered .sol domains
///
/// This function mirrors js/src/utils/getAllRegisteredDomains.ts
/// The account data is sliced to avoid enormous payload and only the owner is returned
///
/// [rpc] - The RPC client for Solana blockchain communication
///
/// Returns a list of ProgramAccount objects containing all registered domains
Future<List<ProgramAccount>> getAllRegisteredDomains(RpcClient rpc) async {
  final filters = [
    const MemcmpFilter(
      offset: 0,
      bytes: rootDomainAddress,
      encoding: 'base58',
    ),
  ];

  const dataSlice = DataSlice(offset: 32, length: 32);

  final accounts = await rpc.getProgramAccounts(
    nameProgramAddress,
    encoding: 'base64',
    filters: filters,
    dataSlice: dataSlice,
  );

  return accounts;
}
