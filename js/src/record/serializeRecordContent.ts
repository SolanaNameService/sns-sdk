import { Buffer } from "buffer";
import ipaddr from "ipaddr.js";
import punycode from "punycode/punycode.js";

import { bech32 } from "@scure/base";
import { PublicKey } from "@solana/web3.js";

import {
  InvalidAAAARecordError,
  InvalidARecordError,
  InvalidEvmAddressError,
  InvalidInjectiveAddressError,
  InvalidRecordInputError,
} from "../error";
import { Record } from "../types/record";
import { check } from "../utils/check";
import { EVM_RECORDS, UTF8_ENCODED } from "./const";

/**
 * Serializes record content according to SNS-IP 1.
 *
 * @param content Record content
 * @param record Record type
 * @returns Serialized record content.
 *
 * @example
 * ```ts
 * const bytes = serializeRecordContent("https://example.com", Record.Url);
 * ```
 */
export const serializeRecordContent = (
  content: string,
  record: Record,
): Buffer => {
  const utf8Encoded = UTF8_ENCODED.has(record);
  if (utf8Encoded) {
    if (record === Record.CNAME || record === Record.TXT) {
      content = punycode.encode(content);
    }
    return Buffer.from(content, "utf-8");
  } else if (record === Record.SOL) {
    return new PublicKey(content).toBuffer();
  } else if (EVM_RECORDS.has(record)) {
    check(
      content.slice(0, 2) === "0x",
      new InvalidEvmAddressError("The record content must start with `0x`"),
    );
    return Buffer.from(content.slice(2), "hex");
  } else if (record === Record.Injective) {
    const decoded = bech32.decodeToBytes(content);
    check(
      decoded.prefix === "inj",
      new InvalidInjectiveAddressError(
        "The record content must start with `inj",
      ),
    );
    check(
      decoded.bytes.length === 20,
      new InvalidInjectiveAddressError(`The record data must be 20 bytes long`),
    );
    return Buffer.from(decoded.bytes);
  } else if (record === Record.A) {
    const array = ipaddr.parse(content).toByteArray();
    check(
      array.length === 4,
      new InvalidARecordError("The record content must be 4 bytes long"),
    );
    return Buffer.from(array);
  } else if (record === Record.AAAA) {
    const array = ipaddr.parse(content).toByteArray();
    check(
      array.length === 16,
      new InvalidAAAARecordError("The record content must be 16 bytes long"),
    );
    return Buffer.from(array);
  } else {
    throw new InvalidRecordInputError("The record content is malformed");
  }
};
