/**
 * Shared Solana Kit codecs used by JS Kit SDK APIs.
 * @module Codecs
 */
import { getTokenCodec } from "@solana-program/token";
import {
  getAddressCodec,
  getBase58Codec,
  getBase64Codec,
  getUtf8Codec,
} from "@solana/kit";

/** Codec for serializing and deserializing Solana addresses. */
export const addressCodec = getAddressCodec();

/** Codec for Base58-encoded binary data. */
export const base58Codec = getBase58Codec();

/** Codec for Base64-encoded binary data. */
export const base64Codec = getBase64Codec();

/** Codec for SPL Token account data. */
export const tokenCodec = getTokenCodec();

/** Codec for UTF-8 text data. */
export const utf8Codec = getUtf8Codec();
