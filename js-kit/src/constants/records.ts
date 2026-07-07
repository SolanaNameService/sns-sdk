import { Address } from "@solana/kit";

import { Record } from "../types/record";

/**
 * Maps record types to guardian addresses used for Right of Association verification.
 */
export const GUARDIANS = new Map<Record, Address>([
  [Record.CNAME, "ExXjtfdQe8JacoqP9Z535WzQKjF4CzW1TTRKRgpxvya3" as Address],
  [Record.Url, "ExXjtfdQe8JacoqP9Z535WzQKjF4CzW1TTRKRgpxvya3" as Address],
]);

/**
 * Record types that use Ethereum/secp256k1 Right of Association validation.
 */
export const ETH_ROA_RECORDS = new Set<Record>([
  Record.BASE,
  Record.BSC,
  Record.ETH,
  Record.Injective,
]);

/**
 * Record types whose content is a `0x`-prefixed EVM address.
 */
export const EVM_RECORDS = new Set<Record>([
  Record.BASE,
  Record.BSC,
  Record.ETH,
]);

/**
 * Record types whose content is UTF-8 encoded.
 */
export const UTF8_ENCODED_RECORDS = new Set<Record>([
  Record.ARWV,
  Record.Backpack,
  Record.BTC,
  Record.CNAME,
  Record.Discord,
  Record.DOGE,
  Record.Email,
  Record.Github,
  Record.IPFS,
  Record.IPNS,
  Record.LTC,
  Record.Pic,
  Record.POINT,
  Record.Reddit,
  Record.SHDW,
  Record.Telegram,
  Record.Twitter,
  Record.TXT,
  Record.Url,
  Record.Bio,
]);

/**
 * Record types whose Right of Association verifier is derived from the record content itself.
 */
export const SELF_SIGNED_RECORDS = new Set<Record>([
  Record.BASE,
  Record.BSC,
  Record.ETH,
  Record.Injective,
  Record.SOL,
]);
