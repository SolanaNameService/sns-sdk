import { type Bech32DecodedWithArray, bech32 } from "@scure/base";
import type { Address, ReadonlyUint8Array } from "@solana/kit";
import { parse as parseIp } from "ipaddr.js";
import { encode as encodePunycode } from "punycode/";

import { addressCodec, utf8Codec } from "../../codecs";
import { EVM_RECORDS, UTF8_ENCODED_RECORDS } from "../../constants/records";
import {
  InvalidAAAARecordError,
  InvalidARecordError,
  InvalidEvmAddressError,
  InvalidInjectiveAddressError,
  InvalidRecordInputError,
} from "../../errors";
import { Record } from "../../types/record";
import { _check } from "../check";
import { uint8ArrayFromHex } from "../uint8Array/uint8ArrayFromHex";

const EVM_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;

interface SerializeRecordContentParams {
  content: string;
  record: Record;
}

/**
 * Serializes record content according to SNS-IP 1.
 *
 * `CNAME` and `TXT` content is punycode-encoded before UTF-8 serialization.
 *
 * @param params Record serialization parameters
 * @param params.content Record content to serialize
 * @param params.record Record type
 * @returns Serialized record content.
 * @throws InvalidEvmAddressError If an EVM record is not a `0x`-prefixed 20-byte hex address.
 * @throws InvalidInjectiveAddressError If an Injective record is not a valid Injective address.
 * @throws InvalidARecordError If an `A` record is not a valid IPv4 address.
 * @throws InvalidAAAARecordError If an `AAAA` record is not a valid IPv6 address.
 * @throws InvalidRecordInputError If the record type or content is unsupported.
 */
export const serializeRecordContent = ({
  content,
  record,
}: SerializeRecordContentParams): ReadonlyUint8Array => {
  const utf8Encoded = UTF8_ENCODED_RECORDS.has(record);
  if (utf8Encoded) {
    if (record === Record.CNAME || record === Record.TXT) {
      content = encodePunycode(content);
    }
    return utf8Codec.encode(content);
  } else if (record === Record.SOL) {
    return addressCodec.encode(content as Address);
  } else if (EVM_RECORDS.has(record)) {
    _check(
      EVM_ADDRESS_REGEX.test(content),
      new InvalidEvmAddressError(
        "The record content must be a valid EVM address starting with `0x`"
      )
    );
    return uint8ArrayFromHex(content.slice(2));
  } else if (record === Record.Injective) {
    let decoded: Bech32DecodedWithArray<string>;

    try {
      decoded = bech32.decodeToBytes(content);
    } catch {
      throw new InvalidInjectiveAddressError(
        "The record content must be a valid Injective address"
      );
    }

    _check(
      decoded.prefix === "inj" && content.length === 42,
      new InvalidInjectiveAddressError(
        "The record content must start with `inj`"
      )
    );
    _check(
      decoded.bytes.length === 20,
      new InvalidInjectiveAddressError("The record data must be 20 bytes long")
    );

    return decoded.bytes;
  } else if (record === Record.A) {
    let array: number[];

    try {
      array = parseIp(content).toByteArray();
    } catch {
      throw new InvalidARecordError(
        "The record content must be a valid IPv4 address"
      );
    }
    _check(
      array.length === 4,
      new InvalidARecordError("The record content must be 4 bytes long")
    );

    return new Uint8Array(array);
  } else if (record === Record.AAAA) {
    let array: number[];

    try {
      array = parseIp(content).toByteArray();
    } catch {
      throw new InvalidAAAARecordError(
        "The record content must be a valid IPv6 address"
      );
    }
    _check(
      array.length === 16,
      new InvalidAAAARecordError("The record content must be 16 bytes long")
    );

    return new Uint8Array(array);
  } else {
    throw new InvalidRecordInputError("The record content is malformed");
  }
};
