/// Test constants for SNS SDK tests
///
/// This file provides common test utilities and constants
/// similar to js-kit/tests/constants.ts
library;

//// Test constants mirroring JavaScript SDK tests
/// Based on js/tests/derivation.test.ts and js-kit/tests/constants.ts

import 'dart:io';
import 'package:dotenv/dotenv.dart';

/// Global dotenv instance
final _dotEnv = DotEnv();
bool _envLoaded = false;

void _loadEnvIfNeeded() {
  if (!_envLoaded) {
    final envFile = File('.env');
    if (envFile.existsSync()) {
      _dotEnv.load(['.env']);
      _envLoaded = true;
    }
  }
}

/// Test RPC endpoint - mirrors JavaScript SDK test setup
String get testRpcUrl {
  _loadEnvIfNeeded();
  return Platform.environment['RPC_URL'] ??
      _dotEnv['RPC_URL'] ??
      'https://api.mainnet-beta.solana.com';
}

/// Devnet RPC endpoint for devnet-specific tests
String get devnetRpcUrl {
  _loadEnvIfNeeded();
  return Platform.environment['RPC_URL_DEVNET'] ??
      _dotEnv['RPC_URL_DEVNET'] ??
      'https://api.devnet.solana.com';
}

/// Domain derivation test cases - exact match with js/tests/derivation.test.ts
const domainDerivationTestCases = [
  {
    'domain': 'bonfida',
    'address': 'Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb',
  },
  {
    'domain': 'bonfida.sol',
    'address': 'Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb',
  },
  {
    'domain': 'dex.bonfida',
    'address': 'HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu',
  },
  {
    'domain': 'dex.bonfida.sol',
    'address': 'HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu',
  },
];

/// Resolution test cases - mirrors js/tests/resolve.test.ts
const resolveTestCases = [
  {
    'domain': 'sns-ip-5-wallet-1',
    'result': 'ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs',
  },
  {
    'domain': 'sns-ip-5-wallet-2',
    'result': 'AxwzQXhZNJb9zLyiHUQA12L2GL7CxvUNrp6neee6r3cA',
  },
  {
    'domain': 'sns-ip-5-wallet-4',
    'result': '7PLHHJawDoa4PGJUK3mUnusV7SEVwZwEyV5csVzm86J4',
  },
  {
    'domain': 'sns-ip-5-wallet-5',
    'result': '96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr',
    'allowPda': true,
  },
  {
    'domain': 'sns-ip-5-wallet-7',
    'result': '53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH',
  },
];

/// Record test data - mirrors js/tests/records.test.ts
const recordTestDomain = '🍍';
const recordTestResults = {
  'ipfs': 'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR',
  'arweave': 'some-arweave-hash',
  'eth': '0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6',
  'btc': '3JfBcjv7TbYN9yQsyfcNeHGLcRjgoHhV3z',
  'ltc': 'MK6deR3Mi6dUsim9M3GPDG2xfSeSAgSrpQ',
  'doge': 'DC79kjg58VfDZeMj9cWNqGuDfYfGJg9DjZ',
  'email': '🍍@gmail.com',
  'url': '🍍.io',
  'discord': '@🍍#7493',
  'github': '@🍍_dev',
  'reddit': '@reddit-🍍',
  'twitter': '@🍍',
  'telegram': '@🍍-tg',
};

/// Subdomain test cases
const subdomainTestDomain = 'test.🇺🇸.sol';
const subdomainTestResults = {
  'email': 'test@test.com',
};

/// BSC test case - mirrors js/tests/records.test.ts
const bscTestCase = {
  'domain': 'aanda.sol',
  'result': '0x4170ad697176fe6d660763f6e4dfcf25018e8b63',
};

/// Multiple records test case
const multipleRecordsTestCase = {
  'domain': '🍍',
  'records': ['telegram', 'github', 'backpack'],
  'results': ['@🍍-tg', '@🍍_dev', null], // backpack record doesn't exist
};

/// Serialization test cases - covers all record types
const serializationTestCases = [
  {'content': 'this is a test', 'record': 'txt'},
  {
    'content': 'ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs',
    'record': 'sol',
    'length': 32
  },
  {
    'content': 'inj13glcnaum2xqv5a0n0hdsmv0f6nfacjsfvrh5j9',
    'record': 'injective',
    'length': 20
  },
  {
    'content': '0xc0ffee254729296a45a3885639ac7e10f9d54979',
    'record': 'eth',
    'length': 20
  },
  {'content': 'test@example.com', 'record': 'email'},
  {'content': 'https://example.com', 'record': 'url'},
  {'content': 'QmExample123456789', 'record': 'ipfs'},
  {'content': '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'record': 'btc'},
];

/// Test wallet addresses for binding tests
const testWallets = {
  'burnDomainOwner': 'Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8',
  'burnDomainRefund': '3Wnd5Df69KitZfUoPYZU438eFRNwGHkhLnSAWL65PxJX',
  'testOwner': 'HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA',
};

/// Known domain prices from js/tests/get-domain-price-from-name.test.ts
const domainPriceTestCases = [
  {'name': 'a', 'expected': 750}, // 1 character
  {'name': 'ab', 'expected': 700}, // 2 characters
  {'name': 'abc', 'expected': 640}, // 3 characters
  {'name': 'abcd', 'expected': 160}, // 4 characters
  {'name': 'abcde', 'expected': 20}, // 5+ characters
];

/// Test timeouts matching JavaScript SDK
const testTimeouts = {
  'short': 10000, // 10 seconds
  'medium': 20000, // 20 seconds
  'long': 50000, // 50 seconds
};

/// Random test address for negative test cases
const String randomAddress = 'TEStzh6fnTp932uQRmy6cKbo79EwhwgjvKULX4s15Bo';

/// Test domains and their expected owners from the JS SDK tests
const Map<String, String> testDomains = {
  'sns-ip-5-wallet-1': 'ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs',
  'sns-ip-5-wallet-2': 'AxwzQXhZNJb9zLyiHUQA12L2GL7CxvUNrp6neee6r3cA',
  'sns-ip-5-wallet-3': 'ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs',
  'sns-ip-5-wallet-4': '7PLHHJawDoa4PGJUK3mUnusV7SEVwZwEyV5csVzm86J4',
  'sns-ip-5-wallet-5': '96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr',
  'bonfida': 'HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA',
  'wallet-guide-4': 'Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ',
  'wallet-guide-9': 'Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8',
  'pda-owned-domain': 'DomainPDA1111111111111111111111111111111111',
};

/// Test domain addresses (derived from actual getDomainAddress calls)
const Map<String, String> testDomainAddresses = {
  'sns-ip-5-wallet-1': 'DvChMZjEaXmkCDbozjQcGWT2voMPmkWCNnQm8wRyobFR',
  'test.sns-ip-5-wallet-1': 'GqTQ76B2NTmZaHQ7xK7zvSmerp2sFXDZFiyxa7QXdX1q',
  'bonfida': 'E5JLjQeVkY2AkR8CTk9ti96CimRJoCxZm9Knh5BWQgfe',
  'dex.bonfida': 'Cb8ySFJ7Ru2C3DgtEXsoXC61pui53bP2WXHbrpWh47eD',
};
