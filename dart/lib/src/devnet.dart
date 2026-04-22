/// Devnet-specific constants and bindings for SNS operations
///
/// This module mirrors js/src/devnet.ts providing devnet-specific addresses,
/// constants, and utility functions for testing and development.
library;

/// Devnet-specific constants
class DevnetConstants {
  /// The Solana Name Service program ID on devnet
  static const String nameProgramId =
      'namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX';

  /// Hash prefix used to derive domain name addresses
  static const String hashPrefix = 'SPL Name Service';

  /// The .sol TLD on devnet
  static const String rootDomainAccount =
      '5eoDkP6vCQBXqDV9YN2NdUs3nmML3dMRNmEYpiyVNBm2';

  /// The Registry program ID on devnet
  static const String registerProgramId =
      'snshBoEQ9jx4QoHBpZDQPYdNCtw7RMxJvYrKFEhwaPJ';

  /// The reverse lookup class on devnet
  static const String reverseLookupClass =
      '7NbD1vprif6apthEZAqhRfYuhrqnuderB8qpnXGCc8H';

  /// USDC mint on devnet
  static const String usdcMint = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';

  /// Test referrers on devnet
  static const List<String> referrers = [
    '3ogYncmMM5CmytsGCqKHydmXmKUZ6sGWvizkzqwT7zb1', // Test wallet
  ];

  /// Token symbol to mint mapping on devnet
  static const Map<String, String> tokenSymMint = {
    '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU': 'USDC',
    'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS': 'USDT',
    'So11111111111111111111111111111111111111112': 'SOL',
    'fidaWCioBQjieRrUQDxxS5Uxmq1CLi2VuVRyv4dEBey': 'FIDA',
    'DL4ivZm3NVHWk9ZvtcqTchxoKArDK4rT3vbDx2gYVr7P': 'INJ',
  };

  /// Pyth feed configurations on devnet
  static const Map<String, Map<String, String>> pythFeeds = {
    '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU': {
      'price': '5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7',
      'product': '6NpdXrQEpmDZ3jZKmM2rhdmkd3H6QAk23j2x8bkXcHKA',
    },
    'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS': {
      'price': '38xoQ4oeJCBrcVvca2cGk7iV1dAfrmTR1kmhSCJQ8Jto',
      'product': 'C5wDxND9E61RZ1wZhaSTWkoA8udumaHnoQY6BBsiaVpn',
    },
    'So11111111111111111111111111111111111111112': {
      'price': 'J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix',
      'product': '3Mnn2fX6rQyUsyELYms1sBJyChWofzSNRoqYzvgMVz5E',
    },
    'EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp': {
      'price': '7teETxN9Y8VK6uJxsctHEwST75mKLLwPH1jaFdvTQCpD',
      'product': '5kWV4bhHeZANzg5MWaYCQYEEKHjur5uz1mu5vuLHwiLB',
    },
    'DL4ivZm3NVHWk9ZvtcqTchxoKArDK4rT3vbDx2gYVr7P': {
      'price': '44uRsNnT35kjkscSu59MxRr9CfkLZWf6gny8bWqUbVxE',
      'product': '7UHB783Nh4avW3Yw9yoktf2KjxipU56KPahA51RnCCYE',
    },
  };

  /// Pyth mapping account on devnet
  static const String pythMappingAcc =
      'BmA9Z6FjioHJPpjT39QazZyhDRUdZy2ezwx4GiDdE2u2';

  /// Vault owner on devnet
  static const String vaultOwner =
      'SNSaTJbEv2iT3CUrCQYa9zpGjbBVWhFCPaSJHkaJX34';
}
