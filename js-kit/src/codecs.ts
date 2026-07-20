import { getTokenCodec } from "@solana-program/token";
import {
  getAddressCodec,
  getBase58Codec,
  getBase64Codec,
  getUtf8Codec,
} from "@solana/kit";

export const addressCodec = getAddressCodec();

export const base58Codec = getBase58Codec();

export const base64Codec = getBase64Codec();

export const tokenCodec = getTokenCodec();

export const utf8Codec = getUtf8Codec();
