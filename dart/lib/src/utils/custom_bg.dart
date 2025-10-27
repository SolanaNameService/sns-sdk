import '../constants/addresses.dart';
import '../errors/sns_errors.dart';
import '../types/custom_bg.dart';
import 'get_domain_key_sync.dart';

/// Artist public keys for custom backgrounds
const String _degenPoetKey = 'ART5dr4bDic2sQVZoFheEmUxwQq5VGSx9he7JxHcXNQD';
const String _rgb0x00Key = 'CSWvuDHXExVGEMR9kP8xYAHuNjXogeRck9Cnr312CC9g';
const String _retardioKey = 'J2Q2j6kpSg7tq8JzueCHNTQNcyNnQkvr85RhsFnYZWeG';
const String _numberArtKey = '6vwnZJZNQjtY4zR93YUuyeDUBhacLLH2mQaZiJAvVwzu';

/// Result of custom background key derivation
class CustomBgKeys {
  const CustomBgKeys({
    required this.domainKey,
    required this.bgKey,
  });

  /// The domain key for the custom background
  final String domainKey;

  /// The background key
  final String bgKey;
}

/// Gets the custom background keys for a domain
///
/// This function mirrors js/src/custom-bg.ts getCustomBgKeys
///
/// [domain] - The domain name
/// [customBg] - The custom background type
///
/// Returns the domain and background keys
Future<CustomBgKeys> getCustomBgKeys(String domain, CustomBg customBg) async {
  final hashedBg = getHashedNameSync(customBg.value);
  final hashedDomain = getHashedNameSync(domain);

  final domainKey = await getNameAccountKeySync(
    hashedDomain,
    nameParent: customBgTld,
  );

  final bgKey = await getNameAccountKeySync(
    hashedBg,
    nameParent: domainKey,
  );

  return CustomBgKeys(
    domainKey: domainKey,
    bgKey: bgKey,
  );
}

/// Gets the artist public key for a custom background
///
/// This function mirrors js/src/custom-bg.ts getArtistPubkey
///
/// [bg] - The custom background type
///
/// Returns the artist's public key
/// Throws [InvalidCustomBgError] if the background is invalid
String getArtistPubkey(CustomBg bg) {
  switch (bg) {
    case CustomBg.degenPoet1:
      return _degenPoetKey;
    case CustomBg.rgb0x001:
      return _rgb0x00Key;
    case CustomBg.retardio1:
    case CustomBg.retardio2:
    case CustomBg.retardio3:
      return _retardioKey;
    case CustomBg.numberArt0:
    case CustomBg.numberArt1:
    case CustomBg.numberArt2:
    case CustomBg.numberArt3:
    case CustomBg.numberArt4:
    case CustomBg.numberArt5:
    case CustomBg.numberArt6:
    case CustomBg.numberArt7:
    case CustomBg.numberArt8:
    case CustomBg.numberArt9:
      return _numberArtKey;
    case CustomBg.valentineDay2025:
    case CustomBg.monkedao:
      return vaultOwner;
  }
}
