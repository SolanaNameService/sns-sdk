import ipaddr from "ipaddr.js";
import punycode from "punycode/punycode.js";

import { bech32 } from "@scure/base";
import { PublicKey } from "@solana/web3.js";

import { InvalidRecordDataError } from "../error";
import { Record } from "../types/record";
import { EVM_RECORDS, UTF8_ENCODED } from "./const";

import type { Buffer } from "buffer";

/**
 * Deserializes record content according to SNS-IP 1.
 *
 * @param content Serialized record content
 * @param record Record type
 * @returns Deserialized record content.
 */
export const deserializeRecordContent = (
  content: Buffer,
  record: Record,
): string => {
  const utf8Encoded = UTF8_ENCODED.has(record);

  if (utf8Encoded) {
    const decoded = content.toString("utf-8");
    if (record === Record.CNAME || record === Record.TXT) {
      return punycode.decode(decoded);
    }
    return decoded;
  } else if (record === Record.SOL) {
    return new PublicKey(content).toBase58();
  } else if (EVM_RECORDS.has(record)) {
    return "0x" + content.toString("hex");
  } else if (record === Record.Injective) {
    return bech32.encode("inj", bech32.toWords(content));
  } else if (record === Record.A || record === Record.AAAA) {
    return ipaddr.fromByteArray([...content]).toString();
  } else {
    throw new InvalidRecordDataError("The record content is malformed");
  }
};
