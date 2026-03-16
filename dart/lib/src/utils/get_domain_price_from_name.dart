/// Domain pricing utilities for SNS domains
///
/// This module provides pricing calculations for domain registration,
/// mirroring the functionality from the JavaScript SDK exactly.
library;

import 'package:characters/characters.dart';

/// Retrieves the registration cost in USD of a domain from its name
///
/// The pricing is based on the number of grapheme clusters (characters)
/// in the domain name, with shorter names being more expensive.
///
/// Pricing structure:
/// - 1 character: $750
/// - 2 characters: $700
/// - 3 characters: $640
/// - 4 characters: $160
/// - 5+ characters: $20
///
/// @param name The domain name (without .sol suffix)
/// @returns The price in USD
int getDomainPriceFromName(String name) {
  // Count grapheme clusters (actual visual characters) - emojis can be complex
  final length = name.characters.length;

  switch (length) {
    case 1:
      return 750;
    case 2:
      return 700;
    case 3:
      return 640;
    case 4:
      return 160;
    default:
      return 20;
  }
}

/// Converts USD price to lamports based on current SOL price
///
/// This is a utility function to convert the USD pricing to SOL/lamports
/// for actual transactions. The SOL price would need to be fetched from
/// an oracle or price feed.
///
/// @param usdPrice The price in USD
/// @param solPriceUsd The current SOL price in USD
/// @returns The price in lamports (1 SOL = 1,000,000,000 lamports)
int convertUsdToLamports(int usdPrice, double solPriceUsd) {
  final solAmount = usdPrice / solPriceUsd;
  return (solAmount * 1000000000).round(); // 1 SOL = 1e9 lamports
}

/// Gets the domain price in lamports
///
/// This combines the USD pricing with SOL price conversion.
/// In practice, the SOL price would be fetched from a Pyth oracle.
///
/// @param name The domain name
/// @param solPriceUsd The current SOL price in USD
/// @returns The price in lamports
int getDomainPriceInLamports(String name, double solPriceUsd) {
  final usdPrice = getDomainPriceFromName(name);
  return convertUsdToLamports(usdPrice, solPriceUsd);
}
