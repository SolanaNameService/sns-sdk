import { Record } from "../types/record";
import { InvalidRecordDataError } from "../error";
import { PublicKey } from "@solana/web3.js";
import { decode as decodePunnycode } from "punycode";
import { bech32 } from "@scure/base";
import { fromByteArray as ipFromByteArray } from "ipaddr.js";

import { UTF8_ENCODED, EVM_RECORDS } from "./const";

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
      return decodePunnycode(decoded);
    }
    return decoded;
  } else if (record === Record.SOL) {
    return new PublicKey(content).toBase58();
  } else if (EVM_RECORDS.has(record)) {
    return "0x" + content.toString("hex");
  } else if (record === Record.Injective) {
    return bech32.encode("inj", bech32.toWords(content));
  } else if (record === Record.A || record === Record.AAAA) {
    return ipFromByteArray([...content]).toString();
  } else {
    throw new InvalidRecordDataError("The record content is malformed");
  }
};
