import { describe, expect, test } from "@jest/globals";
import { deserializeRecordContent } from "../src/record/deserializeRecordContent";
import { serializeRecordContent } from "../src/record/serializeRecordContent";
import { getRecordV2Key } from "../src/record/getRecordV2Key";
import { Record } from "../src/types/record";
import { Keypair } from "@solana/web3.js";
import { UnsupportedTldError } from "../src/error";

test("Record content serialization/deserialization", () => {
  const items = [
    { content: "this is a test", record: Record.TXT },
    {
      content: Keypair.generate().publicKey.toBase58(),
      record: Record.SOL,
      length: 32,
    },
    {
      content: "inj13glcnaum2xqv5a0n0hdsmv0f6nfacjsfvrh5j9",
      record: Record.Injective,
      length: 20,
    },
    {
      content: "example.com",
      record: Record.CNAME,
    },
    {
      content: "example.com",
      record: Record.CNAME,
    },
    {
      content: "0xc0ffee254729296a45a3885639ac7e10f9d54979",
      record: Record.ETH,
      length: 20,
    },
    {
      content: "1.1.1.4",
      record: Record.A,
      length: 4,
    },
    {
      content: "2345:425:2ca1::567:5673:23b5",
      record: Record.AAAA,
      length: 16,
    },
    {
      content: "username",
      record: Record.Discord,
    },
    {
      content: "k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8",
      record: Record.IPNS,
    },
  ];

  items.forEach((e) => {
    const ser = serializeRecordContent(e.content, e.record);
    const des = deserializeRecordContent(ser, e.record);
    expect(des).toBe(e.content);
    if (e.length) {
      expect(ser.length).toBe(e.length);
    }
  });
});

describe("getRecordV2Key - input validation", () => {
  test("throws UnsupportedTldError on bare name", () => {
    expect(() => getRecordV2Key("bonfida", Record.SOL)).toThrow(
      UnsupportedTldError,
    );
  });
});
