import { describe, expect, test } from "@jest/globals";
import { deserializeRecordContent } from "../src/record/deserializeRecordContent";
import { serializeRecordContent } from "../src/record/serializeRecordContent";
import { getRecordV1Key } from "../src/record/getRecordV1Key";
import { getRecordV2Key } from "../src/record/getRecordV2Key";
import { Record } from "../src/types/record";
import { Keypair, PublicKey } from "@solana/web3.js";
import { UnsupportedTldError } from "../src/error";
import { verifyStaleness } from "../src/record/verifyStaleness";
import { verifyRightOfAssociation } from "../src/record/verifyRightOfAssociation";
import { createRecord } from "../src/bindings/createRecord";
import { updateRecord } from "../src/bindings/updateRecord";
import { deleteRecord } from "../src/bindings/deleteRecord";
import { setRecordStalenessVerifier } from "../src/bindings/setRecordStalenessVerifier";
import { setRecordRoaVerifier } from "../src/bindings/setRecordRoaVerifier";
import { validateRecordRoa } from "../src/bindings/validateRecordRoa";
import { validateRecordRoaEthereum } from "../src/bindings/validateRecordRoaEthereum";
import { getRecord } from "../src/record/getRecord";
import { getMultipleRecords } from "../src/record/getMultipleRecords";

const key = PublicKey.default;
const connection = {} as any;

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

describe("record key derivation and API domain validation", () => {
  test("getRecordV1Key accepts a TLD-trimmed name", () => {
    expect(getRecordV1Key("mydomain", Record.SOL)).toBeInstanceOf(PublicKey);
  });

  test("getRecordV2Key accepts a TLD-trimmed name", () => {
    expect(getRecordV2Key("mydomain", Record.SOL)).toBeInstanceOf(PublicKey);
  });

  test("verifyStaleness rejects bare domain", async () => {
    await expect(
      verifyStaleness(connection, Record.Github, "mydomain"),
    ).rejects.toThrow(UnsupportedTldError);
  });

  test("verifyRightOfAssociation rejects bare domain", async () => {
    await expect(
      verifyRightOfAssociation(
        connection,
        Record.Github,
        "mydomain",
        Buffer.alloc(32),
      ),
    ).rejects.toThrow(UnsupportedTldError);
  });

  test("getRecord rejects bare domain", async () => {
    await expect(
      getRecord(connection, "mydomain", Record.Github),
    ).rejects.toThrow(UnsupportedTldError);
  });

  test("getMultipleRecords rejects bare domain", async () => {
    await expect(
      getMultipleRecords(connection, "mydomain", [Record.Github]),
    ).rejects.toThrow(UnsupportedTldError);
  });

  test("createRecord rejects bare domain", () => {
    expect(() =>
      createRecord("mydomain", Record.Github, "value", key, key),
    ).toThrow(UnsupportedTldError);
  });

  test("updateRecord rejects bare domain", () => {
    expect(() =>
      updateRecord("mydomain", Record.Github, "value", key, key),
    ).toThrow(UnsupportedTldError);
  });

  test("deleteRecord rejects bare domain", () => {
    expect(() => deleteRecord("mydomain", Record.Github, key, key)).toThrow(
      UnsupportedTldError,
    );
  });

  test("setRecordStalenessVerifier rejects bare domain", () => {
    expect(() =>
      setRecordStalenessVerifier("mydomain", Record.Github, key, key, key),
    ).toThrow(UnsupportedTldError);
  });

  test("setRecordRoaVerifier rejects bare domain", () => {
    expect(() =>
      setRecordRoaVerifier("mydomain", Record.Github, key, key, key),
    ).toThrow(UnsupportedTldError);
  });

  test("validateRecordRoa rejects bare domain", () => {
    expect(() =>
      validateRecordRoa("mydomain", Record.Github, key, key, key),
    ).toThrow(UnsupportedTldError);
  });

  test("validateRecordRoaEthereum rejects bare domain", () => {
    expect(() =>
      validateRecordRoaEthereum(
        "mydomain",
        Record.ETH,
        key,
        key,
        Buffer.alloc(64),
        Buffer.alloc(20),
      ),
    ).toThrow(UnsupportedTldError);
  });
});
