import { Record } from "../types/record";
import { PublicKey } from "@solana/web3.js";

/** On-chain record validation scheme identifiers. */
export enum Validation {
  /** No validation is required. */
  None = 0,
  /** Validation uses a Solana signature. */
  Solana = 1,
  /** Validation uses an Ethereum signature. */
  Ethereum = 2,
  /** Solana validation is present but unverified. */
  UnverifiedSolana = 3,
}

/**
 * Maps record types to their guardian public keys.
 */
export const GUARDIANS = new Map<Record, PublicKey>([
  [Record.Url, new PublicKey("ExXjtfdQe8JacoqP9Z535WzQKjF4CzW1TTRKRgpxvya3")],
  [Record.CNAME, new PublicKey("ExXjtfdQe8JacoqP9Z535WzQKjF4CzW1TTRKRgpxvya3")],
]);

/**
 * Record types that use secp256k1 verification.
 */
export const ETH_ROA_RECORDS = new Set<Record>([
  Record.ETH,
  Record.Injective,
  Record.BSC,
  Record.BASE,
]);

/** Record types whose values use EVM address encoding. */
export const EVM_RECORDS = new Set<Record>([
  Record.ETH,
  Record.BSC,
  Record.BASE,
]);

/**
 * Record types encoded as UTF-8 strings.
 */
export const UTF8_ENCODED = new Set<Record>([
  Record.IPFS,
  Record.ARWV,
  Record.LTC,
  Record.DOGE,
  Record.Email,
  Record.Url,
  Record.Discord,
  Record.Github,
  Record.Reddit,
  Record.Twitter,
  Record.Telegram,
  Record.Pic,
  Record.SHDW,
  Record.POINT,
  Record.Backpack,
  Record.TXT,
  Record.CNAME,
  Record.BTC,
  Record.IPNS,
  Record.Bio,
]);

/**
 * Record types self-signed by the public key in their content.
 */
export const SELF_SIGNED = new Set<Record>([
  Record.BASE,
  Record.BSC,
  Record.ETH,
  Record.Injective,
  Record.SOL,
]);
