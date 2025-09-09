/// SNS Dart SDK - Comprehensive Solana Name Service SDK
///
/// Provides complete domain resolution, registration, and management functionality
/// with full feature parity to the TypeScript SDK.
///
/// ## Key Features
/// - SNS-IP-5 compliant domain resolution with NFT and PDA support
/// - Complete record management (SOL, ETH, social media, URLs)
/// - Subdomain creation and hierarchical resolution
/// - NFT-based domain ownership and tokenization
/// - Right-of-Association validation for records
/// - Primary domain resolution for wallet addresses
/// - Optimized for Flutter mobile and web applications
///
/// ## Basic Usage
/// ```dart
/// import 'package:sns_sdk/sns_sdk.dart';
///
/// // Create client
/// final rpc = HttpRpcClient('https://api.mainnet-beta.solana.com');
/// final client = SnsClient(rpc);
///
/// // Resolve domain
/// final owner = await resolve(client, 'bonfida',
///   config: ResolveConfig(allowPda: "any"));
///
/// // Get domain address
/// final result = await getDomainAddress(
///   GetDomainAddressParams(domain: 'bonfida'));
/// ```
///
/// See README.md for complete documentation and examples.
library sns_sdk;

// Address operations
export 'src/address/get_nfts_for_address.dart';
export 'src/address/get_primary_domain.dart';
export 'src/address/get_primary_domains_batch.dart';
// Bindings (with selective exports to avoid conflicts)
export 'src/bindings/burn_domain.dart' show burnDomain, BurnDomainParams;
export 'src/bindings/create_name_registry.dart'
    show createNameRegistry, CreateNameRegistryParams;
export 'src/bindings/create_record.dart' show createRecord;
export 'src/bindings/create_reverse_name.dart'
    show createReverseName, CreateReverseNameParams;
export 'src/bindings/create_subdomain.dart'
    show createSubdomain, CreateSubdomainParams;
export 'src/bindings/delete_name_registry.dart'
    show deleteNameRegistry, DeleteNameRegistryParams;
export 'src/bindings/register_domain_name.dart'
    show registerDomainName, RegisterDomainNameParams;
export 'src/bindings/register_domain_name_v2.dart' show registerDomainNameV2;
export 'src/bindings/register_favorite.dart'
    show setPrimaryDomain, RegisterFavoriteParams;
export 'src/bindings/register_with_nft.dart' show registerWithNft;
export 'src/bindings/transfer_name_ownership.dart'
    show transferNameOwnership, TransferNameOwnershipParams;
export 'src/bindings/transfer_subdomain_new.dart'
    show transferSubdomain, TransferSubdomainParams;
export 'src/bindings/update_name_registry_data.dart'
    show updateNameRegistryData, UpdateNameRegistryDataParams;
export 'src/bindings/update_sol_record_instruction.dart'
    show updateSolRecordInstruction;
export 'src/bindings/validate_roa.dart' show validateRoa;
export 'src/bindings/validate_roa_advanced.dart'
    show validateRoaEthereum, ValidateRoaParams, ValidateRoaEthereumParams;
export 'src/bindings/write_roa.dart' show writeRoa;
// Client
export 'src/client/client.dart';
// Constants
export 'src/constants/addresses.dart';
export 'src/constants/records.dart';
// Devnet support
export 'src/devnet.dart';
// Domain operations
export 'src/domain/get_all_domains.dart';
export 'src/domain/get_domain_address.dart';
export 'src/domain/get_domain_owner.dart';
export 'src/domain/get_domain_record.dart';
export 'src/domain/get_domain_records.dart';
export 'src/domain/get_domains_for_address.dart';
export 'src/domain/get_subdomains.dart';
export 'src/domain/resolve_domain.dart';
// Errors
export 'src/errors/sns_errors.dart';
// Favorite Domain functionality
export 'src/favorite_domain/favorite_domain.dart';
// Instruction builders
export 'src/instructions/instructions.dart';
// Integer types
export 'src/int.dart';
// Mobile integration
export 'src/mobile/mobile_security.dart';
// NFT operations
export 'src/nft/get_domain_mint.dart';
export 'src/nft/get_record_from_mint.dart';
export 'src/nft/nft_record.dart';
export 'src/nft/retrieve_nft_owner.dart';
export 'src/nft/retrieve_nft_owner_v2.dart';
export 'src/nft/retrieve_nfts.dart';
export 'src/nft/retrieve_records.dart';
// Performance optimization
export 'src/performance/cache_manager.dart' hide CacheEntry;
// Record operations
export 'src/record/deserialize_record.dart' hide deserializeRecord;
export 'src/record/get_record.dart';
export 'src/record/get_record_key_sync.dart';
export 'src/record/get_records.dart';
// Individual record helper exports for TypeScript parity
export 'src/record/helpers/record_helpers.dart'
    show
        getArweaveRecord,
        getBackgroundRecord,
        getBackpackRecord,
        getBtcRecord,
        getBscRecord,
        getDiscordRecord,
        getDogeRecord,
        getEmailRecord,
        getEthRecord,
        getGithubRecord,
        getInjectiveRecord,
        getIpfsRecord,
        getLtcRecord,
        getPicRecord,
        getPointRecord,
        getRedditRecord,
        getShdwRecord,
        getSolRecord,
        getTelegramRecord,
        getTwitterRecord,
        getUrlRecord;
export 'src/record/helpers/record_helpers.dart';
export 'src/record/serialize_record.dart';
export 'src/record/simple_deserialize_record.dart' show deserializeRecord;
export 'src/record/verify_record_staleness.dart';
// Record V2 operations - Full Record V2 functionality
export 'src/record_v2/deserialize_record_v2_content.dart';
export 'src/record_v2/get_multiple_records_v2.dart';
export 'src/record_v2/get_record_v2.dart';
export 'src/record_v2/get_record_v2_key.dart';
export 'src/record_v2/serialize_record_v2_content.dart';
export 'src/record_v2/verify_right_of_association.dart';
// Resolve functionality (SNS-IP 5)
export 'src/resolve/resolve.dart';
export 'src/resolve/resolve_sol_record_v1.dart';
export 'src/resolve/resolve_sol_record_v2.dart';
// RPC client
export 'src/rpc/enhanced_solana_rpc_client.dart';
export 'src/rpc/http_rpc_client.dart' hide RpcException;
export 'src/rpc/rpc_client.dart';
export 'src/rpc/websocket_rpc_client.dart' hide AccountChangeNotification;
export 'src/rpc/websocket_subscription_client.dart';
// States
export 'src/states/nft.dart';
export 'src/states/primary_domain.dart';
export 'src/states/registry.dart';
// Twitter integration
export 'src/twitter/twitter.dart';
// Transaction builders (Phase 4: Security Infrastructure)
export 'src/tx/unsigned_transaction.dart';
// Types
export 'src/types/custom_bg.dart';
export 'src/types/record.dart';
export 'src/types/validation.dart';
// Utils - Complete utility layer
export 'src/utils/custom_bg.dart';
export 'src/utils/derive_address.dart';
export 'src/utils/deserialize_record_content.dart';
export 'src/utils/deserialize_reverse.dart';
export 'src/utils/find_subdomains.dart';
// Individual utility exports for TypeScript parity
export 'src/utils/get_domain_key_sync.dart'
    show getHashedNameSync, getNameAccountKeySync;
export 'src/utils/get_domain_key_sync.dart';
export 'src/utils/get_domain_keys_with_reverses.dart';
export 'src/utils/get_domain_price_from_name.dart';
export 'src/utils/get_pyth_feed_account_key.dart';
export 'src/utils/get_reverse_key_sync.dart';
export 'src/utils/get_tokenized_domains.dart';
export 'src/utils/name_hash.dart';
export 'src/utils/reverse_lookup.dart';
export 'src/utils/reverse_lookup_batch.dart';
export 'src/utils/serializers/serialize_record_content.dart';
// Validation
export 'src/validation/ethereum_signature_verifier.dart';
export 'src/validation/staleness_checker.dart';
export 'src/validation/validation.dart' hide ValidationResult;
