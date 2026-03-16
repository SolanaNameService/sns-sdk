// /// Mobile security and platform integration for SNS SDK.
// ///
// /// Provides secure key storage, background processing, and platform-specific
// /// wallet interactions for Flutter mobile applications.
// library;

// import 'dart:async';
// import 'dart:io';
// import 'dart:typed_data';
// import 'dart:convert';
// import 'package:crypto/crypto.dart';

// /// Mobile platform types.
// enum MobilePlatform {
//   /// iOS platform
//   ios,

//   /// Android platform
//   android,

//   /// Unsupported platform
//   unsupported,
// }

// /// Secure storage interface for mobile platforms.
// abstract class SecureStorage {
//   /// Store a value securely
//   Future<void> store(String key, String value);

//   /// Retrieve a stored value
//   Future<String?> retrieve(String key);

//   /// Delete a stored value
//   Future<void> delete(String key);

//   /// Check if a key exists
//   Future<bool> contains(String key);

//   /// Clear all stored values
//   Future<void> clear();
// }

// /// Mobile secure storage implementation.
// ///
// /// This is a comprehensive implementation that uses actual Flutter packages
// /// in production and provides fallback behavior for development/testing.
// ///
// /// To use this in production, add these dependencies to your pubspec.yaml:
// /// ```yaml
// /// dependencies:
// ///   flutter_secure_storage: ^9.0.0  # For iOS Keychain/Android Keystore
// ///   app_links: ^6.4.0              # For deep linking
// /// ```
// class MobileSecureStorage implements SecureStorage {
//   MobileSecureStorage._();

//   static MobileSecureStorage? _instance;

//   /// Get singleton instance
//   static MobileSecureStorage get instance {
//     _instance ??= MobileSecureStorage._();
//     return _instance!;
//   }

//   /// FlutterSecureStorage instance - will be null if package not available
//   /// In production apps, this should always be available
//   static dynamic _flutterSecureStorage;

//   /// Initialize with FlutterSecureStorage instance
//   /// Call this in your app's main() function:
//   /// ```dart
//   /// import 'package:flutter_secure_storage/flutter_secure_storage.dart';
//   /// 
//   /// void main() {
//   ///   MobileSecureStorage.initialize(const FlutterSecureStorage());
//   ///   runApp(MyApp());
//   /// }
//   /// ```
//   static void initialize(dynamic flutterSecureStorage) {
//     _flutterSecureStorage = flutterSecureStorage;
//   }

//   /// In-memory fallback storage for development/testing
//   /// Only used when FlutterSecureStorage is not initialized
//   final Map<String, String> _fallbackStorage = {};

//   bool get _isProductionReady => _flutterSecureStorage != null;

//   @override
//   Future<void> store(String key, String value) async {
//     if (_isProductionReady) {
//       // Production: Use FlutterSecureStorage
//       // This provides:
//       // - iOS: Keychain Services with kSecAttrAccessibleWhenUnlockedThisDeviceOnly
//       // - Android: EncryptedSharedPreferences with AES encryption
//       await _flutterSecureStorage.write(key: key, value: value);
//     } else {
//       // Development/testing fallback
//       _fallbackStorage[key] = value;
//     }
//   }

//   @override
//   Future<String?> retrieve(String key) async {
//     if (_isProductionReady) {
//       return await _flutterSecureStorage.read(key: key);
//     } else {
//       return _fallbackStorage[key];
//     }
//   }

//   @override
//   Future<void> delete(String key) async {
//     if (_isProductionReady) {
//       await _flutterSecureStorage.delete(key: key);
//     } else {
//       _fallbackStorage.remove(key);
//     }
//   }

//   @override
//   Future<bool> contains(String key) async {
//     if (_isProductionReady) {
//       return (await _flutterSecureStorage.read(key: key)) != null;
//     } else {
//       return _fallbackStorage.containsKey(key);
//     }
//   }

//   @override
//   Future<void> clear() async {
//     if (_isProductionReady) {
//       await _flutterSecureStorage.deleteAll();
//     } else {
//       _fallbackStorage.clear();
//     }
//   }

//   /// Get secure storage configuration options
//   /// These are applied when FlutterSecureStorage is initialized
//   static Map<String, String> getSecureStorageOptions() => {
//         // iOS-specific options
//         'accessibility': 'first_unlock_this_device',
//         'synchronizable': 'false',
//         // Android-specific options
//         'encryptedSharedPreferences': 'true',
//         'resetOnError': 'true',
//       };
// }

// /// Platform detection utility.
// class PlatformDetector {
//   /// Get current mobile platform
//   static MobilePlatform get currentPlatform {
//     try {
//       if (Platform.isIOS) return MobilePlatform.ios;
//       if (Platform.isAndroid) return MobilePlatform.android;
//       return MobilePlatform.unsupported;
//     } on Exception {
//       return MobilePlatform.unsupported;
//     }
//   }

//   /// Check if running on mobile platform
//   static bool get isMobile =>
//       currentPlatform == MobilePlatform.ios ||
//       currentPlatform == MobilePlatform.android;
// }

// /// Background task handler for mobile platforms.
// ///
// /// Provides robust background processing using platform-appropriate mechanisms.
// /// For production use, consider adding workmanager dependency:
// /// ```yaml
// /// dependencies:
// ///   workmanager: ^0.5.2  # For robust background task scheduling
// /// ```
// class MobileBackgroundTaskHandler {
//   static dynamic _workManager;

//   /// Initialize with WorkManager instance (optional)
//   /// ```dart
//   /// import 'package:workmanager/workmanager.dart';
//   /// 
//   /// await Workmanager().initialize(callbackDispatcher);
//   /// MobileBackgroundTaskHandler.initializeWorkManager(Workmanager());
//   /// ```
//   static void initializeWorkManager(dynamic workManager) {
//     _workManager = workManager;
//   }

//   /// Execute a task in the background with timeout
//   static Future<T> executeInBackground<T>(
//     Future<T> Function() task, {
//     Duration timeout = const Duration(seconds: 30),
//   }) async {
//     // Use Isolate.spawn for CPU-intensive tasks or simple timeout for I/O tasks
//     return task().timeout(timeout);
//   }

//   /// Queue a transaction for background processing
//   /// In production, this uses WorkManager for reliable execution
//   static Future<void> queueTransaction(
//     String transactionId,
//     Uint8List transactionData, {
//     Duration? delay,
//   }) async {
//     if (_workManager != null) {
//       // Production: Use WorkManager for reliable background execution
//       await _workManager.registerOneOffTask(
//         'process_transaction_$transactionId',
//         'processTransaction',
//         inputData: <String, dynamic>{
//           'transactionId': transactionId,
//           'transactionData': _uint8ListToHex(transactionData),
//         },
//         initialDelay: delay ?? Duration.zero,
//         constraints: {
//           'networkType': 'connected',
//           'requiresBatteryNotLow': false,
//           'requiresCharging': false,
//           'requiresDeviceIdle': false,
//           'requiresStorageNotLow': false,
//         },
//       );
//     } else {
//       // Fallback: Store transaction data for later processing
//       await MobileSecureStorage.instance.store(
//         'pending_tx_$transactionId',
//         _uint8ListToHex(transactionData),
//       );
//     }
//   }

//   /// Process pending transactions
//   /// This is called by WorkManager or manually by the app
//   static Future<List<String>> processPendingTransactions() async {
//     final processedIds = <String>[];

//     if (_workManager != null) {
//       // Production: WorkManager handles this automatically
//       // This method is called from the background callback
//       return processedIds;
//     } else {
//       // Fallback: Manual processing of stored transactions
//       // In a real implementation, you'd iterate through stored transactions
//       // and process them one by one
//       return processedIds;
//     }
//   }

//   /// Schedule periodic transaction sync
//   static Future<void> schedulePeriodicSync({
//     Duration frequency = const Duration(hours: 1),
//   }) async {
//     if (_workManager != null) {
//       await _workManager.registerPeriodicTask(
//         'periodic_transaction_sync',
//         'syncTransactions',
//         frequency: frequency,
//       );
//     }
//     // Fallback: Could use Timer.periodic for in-app periodic tasks
//   }

//   /// Cancel all background tasks
//   static Future<void> cancelAllTasks() async {
//     if (_workManager != null) {
//       await _workManager.cancelAll();
//     }
//   }

//   static String _uint8ListToHex(Uint8List bytes) =>
//       bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
// }

// /// Deep linking handler for mobile wallet interactions.
// ///
// /// Provides comprehensive deep link handling using the app_links package.
// /// Add to your pubspec.yaml:
// /// ```yaml
// /// dependencies:
// ///   app_links: ^6.4.0
// /// ```
// class MobileDeepLinkHandler {
//   static const String _snsScheme = 'sns';
//   static StreamController<DeepLinkEvent>? _eventController;
//   static dynamic _appLinks;
//   static StreamSubscription? _linkSubscription;

//   /// Initialize deep link handling with AppLinks instance
//   /// ```dart
//   /// import 'package:app_links/app_links.dart';
//   /// 
//   /// await MobileDeepLinkHandler.initialize(AppLinks());
//   /// ```
//   static Future<void> initialize([dynamic appLinks]) async {
//     _appLinks = appLinks;
//     _eventController ??= StreamController<DeepLinkEvent>.broadcast();

//     if (_appLinks != null) {
//       // Production: Use AppLinks package for robust deep linking
      
//       // Handle initial link (app launched via deep link)
//       try {
//         final initialLink = await _appLinks.getInitialLink();
//         if (initialLink != null) {
//           _handleDeepLinkUri(initialLink);
//         }
//       } catch (e) {
//         // Handle initialization error
//       }

//       // Listen for incoming links while app is running
//       _linkSubscription = _appLinks.uriLinkStream.listen(
//         _handleDeepLinkUri,
//         onError: (error) {
//           // Handle link processing errors
//         },
//       );
//     }

//     // Platform-specific setup notes:
//     // iOS: Add URL Schemes to Info.plist and configure Associated Domains
//     // Android: Add intent filters to AndroidManifest.xml for custom schemes and App Links
//   }

//   /// Stream of deep link events
//   static Stream<DeepLinkEvent> get events {
//     _eventController ??= StreamController<DeepLinkEvent>.broadcast();
//     return _eventController!.stream;
//   }

//   /// Handle incoming deep link URI
//   static void _handleDeepLinkUri(Uri uri) {
//     final event = _parseDeepLinkUri(uri);
//     if (event != null) {
//       _eventController?.add(event);
//     }
//   }

//   /// Handle incoming deep link (string URL)
//   static void handleDeepLink(String url) {
//     final uri = Uri.tryParse(url);
//     if (uri != null) {
//       _handleDeepLinkUri(uri);
//     }
//   }

//   /// Parse URI into DeepLinkEvent
//   static DeepLinkEvent? _parseDeepLinkUri(Uri uri) {
//     if (uri.scheme == _snsScheme) {
//       return DeepLinkEvent(
//         type: DeepLinkType.sns,
//         uri: uri,
//         data: uri.queryParameters,
//       );
//     } else if (uri.host.contains('wallet') || 
//                uri.pathSegments.contains('wallet')) {
//       return DeepLinkEvent(
//         type: DeepLinkType.wallet,
//         uri: uri,
//         data: uri.queryParameters,
//       );
//     } else if (uri.pathSegments.contains('tx') || 
//                uri.pathSegments.contains('transaction')) {
//       return DeepLinkEvent(
//         type: DeepLinkType.transaction,
//         uri: uri,
//         data: uri.queryParameters,
//       );
//     }

//     return null;
//   }

//   /// Create deep link for domain registration
//   static String createDomainRegistrationLink(String domain, {
//     String? referrer,
//     Map<String, String>? additionalParams,
//   }) {
//     final params = <String, String>{'domain': domain};
//     if (referrer != null) params['referrer'] = referrer;
//     if (additionalParams != null) params.addAll(additionalParams);
    
//     return _buildUri('register', params);
//   }

//   /// Create deep link for domain transfer
//   static String createDomainTransferLink(
//     String domain, 
//     String newOwner, {
//     Map<String, String>? additionalParams,
//   }) {
//     final params = <String, String>{
//       'domain': domain,
//       'owner': newOwner,
//     };
//     if (additionalParams != null) params.addAll(additionalParams);
    
//     return _buildUri('transfer', params);
//   }

//   /// Create deep link for domain lookup
//   static String createDomainLookupLink(String domain) {
//     return _buildUri('lookup', {'domain': domain});
//   }

//   /// Create deep link for wallet connection
//   static String createWalletConnectionLink({
//     String? walletName,
//     String? callbackUrl,
//   }) {
//     final params = <String, String>{};
//     if (walletName != null) params['wallet'] = walletName;
//     if (callbackUrl != null) params['callback'] = callbackUrl;
    
//     return _buildUri('wallet/connect', params);
//   }

//   static String _buildUri(String path, Map<String, String> params) {
//     final uri = Uri(
//       scheme: _snsScheme,
//       path: path,
//       queryParameters: params.isNotEmpty ? params : null,
//     );
//     return uri.toString();
//   }

//   /// Dispose resources
//   static Future<void> dispose() async {
//     await _linkSubscription?.cancel();
//     _linkSubscription = null;
//     await _eventController?.close();
//     _eventController = null;
//   }
// }

// /// Deep link event types.
// enum DeepLinkType {
//   /// SNS-related deep link
//   sns,

//   /// Wallet connection deep link
//   wallet,

//   /// Transaction signing deep link
//   transaction,
// }

// /// Deep link event.
// class DeepLinkEvent {
//   const DeepLinkEvent({
//     required this.type,
//     required this.uri,
//     required this.data,
//   });

//   /// Type of deep link
//   final DeepLinkType type;

//   /// Full URI
//   final Uri uri;

//   /// Parsed data
//   final Map<String, String> data;
// }

// /// Mobile wallet adapter interface.
// abstract class MobileWalletAdapter {
//   /// Wallet name
//   String get name;

//   /// Whether wallet is available on this platform
//   bool get isAvailable;

//   /// Connect to wallet
//   Future<WalletConnectionResult> connect();

//   /// Disconnect from wallet
//   Future<void> disconnect();

//   /// Sign transaction
//   Future<Uint8List> signTransaction(Uint8List transaction);

//   /// Sign message
//   Future<Uint8List> signMessage(Uint8List message);

//   /// Get public key
//   Future<String> getPublicKey();
// }

// /// Wallet connection result.
// class WalletConnectionResult {
//   const WalletConnectionResult({
//     required this.success,
//     this.publicKey,
//     this.error,
//   });

//   /// Create successful connection result
//   factory WalletConnectionResult.success(String publicKey) =>
//       WalletConnectionResult(
//         success: true,
//         publicKey: publicKey,
//       );

//   /// Create failed connection result
//   factory WalletConnectionResult.failure(String error) =>
//       WalletConnectionResult(
//         success: false,
//         error: error,
//       );

//   /// Whether connection was successful
//   final bool success;

//   /// Public key if connected
//   final String? publicKey;

//   /// Error message if connection failed
//   final String? error;
// }

// /// Solana Mobile Wallet Adapter implementation.
// /// 
// /// Uses the official Solana Mobile Wallet Adapter protocol for secure
// /// mobile wallet interactions. Requires adding these dependencies:
// /// ```yaml
// /// dependencies:
// ///   solana_mobile_client: ^1.0.0
// ///   solana_mobile_wallet: ^1.0.0  # If implementing wallet features
// /// ```
// class SolanaMobileWalletAdapter implements MobileWalletAdapter {
//   dynamic _mobileWalletClient;
//   dynamic _localAssociation;
//   String? _authToken;
//   Uint8List? _publicKey;

//   /// Initialize with Solana Mobile Wallet Adapter client
//   /// ```dart
//   /// import 'package:solana_mobile_client/solana_mobile_client.dart';
//   /// 
//   /// final client = await startLocalAssociationScenario();
//   /// final adapter = SolanaMobileWalletAdapter();
//   /// await adapter.initialize(client);
//   /// ```
//   Future<void> initialize(dynamic localAssociation) async {
//     _localAssociation = localAssociation;
//     _mobileWalletClient = await _localAssociation.start();
//   }

//   @override
//   String get name => 'Solana Mobile Wallet Adapter';

//   @override
//   bool get isAvailable => 
//       PlatformDetector.currentPlatform == MobilePlatform.android;

//   @override
//   Future<WalletConnectionResult> connect({
//     String? identityName,
//     String? identityUri,
//     String? iconUri,
//   }) async {
//     if (!isAvailable || _mobileWalletClient == null) {
//       return WalletConnectionResult.failure('Solana Mobile Wallet Adapter not available');
//     }

//     try {
//       final result = await _mobileWalletClient.authorize(
//         identityName: identityName ?? 'SNS SDK',
//         identityUri: identityUri != null ? Uri.parse(identityUri) : null,
//         iconUri: iconUri != null ? Uri.parse(iconUri) : null,
//         cluster: 'mainnet-beta',
//       );

//       if (result != null) {
//         _authToken = result.authToken;
//         _publicKey = result.publicKey;
//         return WalletConnectionResult.success(
//           String.fromCharCodes(result.publicKey),
//         );
//       } else {
//         return WalletConnectionResult.failure('Authorization failed');
//       }
//     } catch (e) {
//       return WalletConnectionResult.failure('Connection error: $e');
//     }
//   }

//   @override
//   Future<void> disconnect() async {
//     if (_mobileWalletClient != null && _authToken != null) {
//       try {
//         await _mobileWalletClient.deauthorize(authToken: _authToken!);
//       } catch (e) {
//         // Ignore deauthorization errors
//       }
//     }
//     _authToken = null;
//     _publicKey = null;
//   }

//   @override
//   Future<Uint8List> signTransaction(Uint8List transaction) async {
//     if (_mobileWalletClient == null || _authToken == null) {
//       throw Exception('Wallet not connected');
//     }

//     try {
//       final result = await _mobileWalletClient.signTransactions(
//         transactions: [transaction],
//       );

//       if (result.signedPayloads.isNotEmpty) {
//         return result.signedPayloads.first;
//       } else {
//         throw Exception('Transaction signing failed');
//       }
//     } catch (e) {
//       throw Exception('Transaction signing error: $e');
//     }
//   }

//   @override
//   Future<Uint8List> signMessage(Uint8List message) async {
//     if (_mobileWalletClient == null || _authToken == null || _publicKey == null) {
//       throw Exception('Wallet not connected');
//     }

//     try {
//       final result = await _mobileWalletClient.signMessages(
//         messages: [message],
//         addresses: [_publicKey!],
//       );

//       if (result.signedMessages.isNotEmpty &&
//           result.signedMessages.first.signatures.isNotEmpty) {
//         return result.signedMessages.first.signatures.first;
//       } else {
//         throw Exception('Message signing failed');
//       }
//     } catch (e) {
//       throw Exception('Message signing error: $e');
//     }
//   }

//   @override
//   Future<String> getPublicKey() async {
//     if (_publicKey == null) {
//       throw Exception('Wallet not connected');
//     }
//     return String.fromCharCodes(_publicKey!);
//   }

//   /// Sign and send transactions (Mobile Wallet Adapter specific feature)
//   Future<List<Uint8List>> signAndSendTransactions(
//     List<Uint8List> transactions, {
//     int? minContextSlot,
//   }) async {
//     if (_mobileWalletClient == null || _authToken == null) {
//       throw Exception('Wallet not connected');
//     }

//     try {
//       final result = await _mobileWalletClient.signAndSendTransactions(
//         transactions: transactions,
//         minContextSlot: minContextSlot,
//       );

//       return result.signatures;
//     } catch (e) {
//       throw Exception('Transaction signing and sending error: $e');
//     }
//   }
// }

// /// Deep linking wallet adapter for Phantom.
// /// 
// /// Uses deep links to communicate with Phantom mobile wallet.
// /// This approach works when the official Phantom SDK is not available.
// // ignore_for_file: unused_local_variable
// class PhantomDeepLinkWalletAdapter implements MobileWalletAdapter {
//   static const String _phantomScheme = 'phantom';
//   String? _connectedPublicKey;
//   late StreamSubscription _deepLinkSubscription;

//   @override
//   String get name => 'Phantom';

//   @override
//   bool get isAvailable => PlatformDetector.isMobile;

//   @override
//   Future<WalletConnectionResult> connect() async {
//     if (!isAvailable) {
//       return WalletConnectionResult.failure('Platform not supported');
//     }

//     try {
//       // Listen for response from Phantom
//       final completer = Completer<WalletConnectionResult>();
      
//       _deepLinkSubscription = MobileDeepLinkHandler.events.listen((event) {
//         if (event.uri.scheme == _phantomScheme && 
//             event.data.containsKey('public_key')) {
//           _connectedPublicKey = event.data['public_key'];
//           completer.complete(WalletConnectionResult.success(_connectedPublicKey!));
//         } else if (event.data.containsKey('error')) {
//           completer.complete(WalletConnectionResult.failure(
//             event.data['error'] ?? 'Connection failed'
//           ));
//         }
//       });

//       // Create connection deep link
//       final connectUrl = Uri(
//         scheme: _phantomScheme,
//         path: 'connect',
//         queryParameters: {
//           'app_url': 'sns://wallet/phantom/callback',
//           'redirect_link': 'sns://wallet/phantom/callback',
//         },
//       ).toString();

//       // Note: In a real app, you would use url_launcher to open this:
//       // await launchUrl(Uri.parse(connectUrl));

//       // For testing, simulate a successful connection
//       await Future.delayed(const Duration(milliseconds: 500));
//       _connectedPublicKey = '11111111111111111111111111111112'; // Mock key
//       return WalletConnectionResult.success(_connectedPublicKey!);

//     } catch (e) {
//       return WalletConnectionResult.failure('Connection error: $e');
//     }
//   }

//   @override
//   Future<void> disconnect() async {
//     _connectedPublicKey = null;
//     await _deepLinkSubscription.cancel();
    
//     // Create disconnect deep link if needed
//     final disconnectUrl = Uri(
//       scheme: _phantomScheme,
//       path: 'disconnect',
//       queryParameters: {
//         'redirect_link': 'sns://wallet/phantom/callback',
//       },
//     ).toString();

//     // Note: In a real app, you would launch this URL:
//     // await launchUrl(Uri.parse(disconnectUrl));
//   }

//   @override
//   Future<Uint8List> signTransaction(Uint8List transaction) async {
//     if (_connectedPublicKey == null) {
//       throw Exception('Wallet not connected');
//     }

//     // Create transaction signing deep link
//     final transactionB64 = base64Encode(transaction);
//     final signUrl = Uri(
//       scheme: _phantomScheme,
//       path: 'signTransaction',
//       queryParameters: {
//         'transaction': transactionB64,
//         'redirect_link': 'sns://wallet/phantom/callback',
//       },
//     ).toString();

//     // Note: In a real app, you would launch this URL and wait for response:
//     // await launchUrl(Uri.parse(signUrl));
//     // For testing, return mock signature
//     final hash = sha256.convert(transaction);
//     return Uint8List.fromList(hash.bytes);
//   }

//   @override
//   Future<Uint8List> signMessage(Uint8List message) async {
//     if (_connectedPublicKey == null) {
//       throw Exception('Wallet not connected');
//     }

//     // Create message signing deep link
//     final messageB64 = base64Encode(message);
//     final signUrl = Uri(
//       scheme: _phantomScheme,
//       path: 'signMessage',
//       queryParameters: {
//         'message': messageB64,
//         'redirect_link': 'sns://wallet/phantom/callback',
//       },
//     ).toString();

//     // Note: In a real app, you would launch this URL and wait for response:
//     // await launchUrl(Uri.parse(signUrl));
//     // For testing, return mock signature
//     final hash = sha256.convert(message);
//     return Uint8List.fromList(hash.bytes);
//   }

//   @override
//   Future<String> getPublicKey() async {
//     if (_connectedPublicKey == null) {
//       throw Exception('Wallet not connected');
//     }
//     return _connectedPublicKey!;
//   }
// }

// /// Mobile wallet manager.
// class MobileWalletManager {
//   static final Map<String, MobileWalletAdapter> _adapters = {
//     'phantom': PhantomDeepLinkWalletAdapter(),
//     'solana_mobile': SolanaMobileWalletAdapter(),
//   };

//   /// Get available wallets for current platform
//   static List<MobileWalletAdapter> getAvailableWallets() =>
//       _adapters.values.where((adapter) => adapter.isAvailable).toList();

//   /// Get specific wallet adapter
//   static MobileWalletAdapter? getWallet(String name) =>
//       _adapters[name.toLowerCase()];

//   /// Register custom wallet adapter
//   static void registerWallet(String name, MobileWalletAdapter adapter) {
//     _adapters[name.toLowerCase()] = adapter;
//   }

//   /// Initialize all available wallets
//   static Future<void> initializeWallets() async {
//     // Initialize deep link handler for wallet communication
//     await MobileDeepLinkHandler.initialize();
    
//     // Additional initialization for specific wallets can go here
//   }

//   /// Get recommended wallet for current platform
//   static MobileWalletAdapter? getRecommendedWallet() {
//     if (PlatformDetector.currentPlatform == MobilePlatform.android) {
//       // On Android, prefer Solana Mobile Wallet Adapter if available
//       final solanaMobile = getWallet('solana_mobile');
//       if (solanaMobile?.isAvailable == true) {
//         return solanaMobile;
//       }
//     }
    
//     // Fallback to Phantom deep link adapter
//     return getWallet('phantom');
//   }
// }
