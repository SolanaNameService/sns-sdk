import { bech32 } from "@scure/base";
import { ReadonlyUint8Array } from "@solana/kit";
import ipaddr from "ipaddr.js";
import punycode from "punycode/punycode.js";

import { addressCodec, utf8Codec } from "../../codecs";
import { EVM_RECORDS, UTF8_ENCODED_RECORDS } from "../../constants/records";
import { InvalidRecordDataError } from "../../errors";
import { Record } from "../../types/record";
import { uint8ArrayToHex } from "../uint8Array/uint8ArrayToHex";

/**
 * Parameters for deserializing record content.
 *
 * @example
 * ```ts
 * const params: DeserializeRecordContentParams = { content, record: Record.Url };
 * ```
 */
export interface DeserializeRecordContentParams {
  /** Serialized record content. */
  content: ReadonlyUint8Array;
  /** Record type. */
  record: Record;
}

/**
 * Deserializes record content according to SNS-IP 1.
 *
 * `CNAME` and `TXT` content is punycode-decoded after UTF-8 deserialization.
 *
 * @param params Record deserialization parameters
 * @param params.content Serialized record content
 * @param params.record Record type
 * @returns Deserialized record content.
 * @throws InvalidRecordDataError If the record type or content is unsupported.
 *
 * @example
 * ```ts
 * const result = await getDomainRecord({
 *   rpc,
 *   domain: "example.sns",
 *   record: Record.Url,
 * });
 * const content = deserializeRecordContent({
 *   content: result.retrievedRecord.getContent(),
 *   record: Record.Url,
 * });
 * ```
 */
export const deserializeRecordContent = ({
  content,
  record,
}: DeserializeRecordContentParams): string => {
  const isUtf8Encoded = UTF8_ENCODED_RECORDS.has(record);

  if (isUtf8Encoded) {
    const decoded = utf8Codec.decode(content);
    if (record === Record.CNAME || record === Record.TXT) {
      return punycode.decode(decoded);
    }
    return decoded;
  } else if (record === Record.SOL) {
    return addressCodec.decode(content);
  } else if (EVM_RECORDS.has(record)) {
    return `0x${uint8ArrayToHex(content)}`;
  } else if (record === Record.Injective) {
    return bech32.encode("inj", bech32.toWords(content as Uint8Array));
  } else if (record === Record.A || record === Record.AAAA) {
    return ipaddr.fromByteArray(Array.from(content)).toString();
  } else {
    throw new InvalidRecordDataError("The record content is malformed");
  }
};
