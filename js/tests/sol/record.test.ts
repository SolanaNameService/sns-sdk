require("dotenv").config();
import { describe, expect, jest, test } from "@jest/globals";
import { Connection, PublicKey } from "@solana/web3.js";
import { getRecordV2Key } from "../../src/record/getRecordV2Key";
import { Record } from "../../src/types/record";
import { UnsupportedTldError } from "../../src/error";
import { createRecord } from "../../src/bindings/createRecord";
import { updateRecord } from "../../src/bindings/updateRecord";
import { deleteRecord } from "../../src/bindings/deleteRecord";
import { setRecordStalenessVerifier } from "../../src/bindings/setRecordStalenessVerifier";
import { setRecordRoaVerifier } from "../../src/bindings/setRecordRoaVerifier";
import { validateRecordRoa } from "../../src/bindings/validateRecordRoa";
import { validateRecordRoaEthereum } from "../../src/bindings/validateRecordRoaEthereum";
import { getRecord } from "../../src/record/getRecord";
import { getMultipleRecords } from "../../src/record/getMultipleRecords";

jest.setTimeout(50_000);

const key = PublicKey.default;
const connection = new Connection(process.env.RPC_URL!);

test("getRecord", async () => {
  const domain = "wallet-guide-9.sol";
  const items = [
    {
      record: Record.IPFS,
      value: "ipfs://test",
      verified: { staleness: true },
    },
    {
      record: Record.Email,
      value: "test@gmail.com",
      verified: { staleness: false },
    },
    {
      record: Record.Url,
      value: "https://google.com",
      verified: { staleness: false },
    },
  ];
  for (let item of items) {
    const res = await getRecord(connection, domain, item.record, {
      deserialize: true,
    });
    expect(res.deserializedContent).toBe(item.value);
    expect(res.verified.staleness).toBe(item.verified.staleness);
  }
});

test("getMultipleRecords", async () => {
  const domain = "wallet-guide-9.sol";
  const items = [
    {
      record: Record.IPFS,
      value: "ipfs://test",
      verified: { staleness: true },
    },
    {
      record: Record.Email,
      value: "test@gmail.com",
      verified: { staleness: false },
    },
    {
      record: Record.Url,
      value: "https://google.com",
      verified: { staleness: false },
    },
  ];
  const res = await getMultipleRecords(
    connection,
    domain,
    items.map((e) => e.record),
    { deserialize: true },
  );
  for (let i = 0; i < items.length; i++) {
    expect(items[i].value).toBe(res[i]?.deserializedContent);
    expect(items[i].record).toBe(res[i]?.record);
    expect(items[i].verified.staleness).toBe(res[i]?.verified.staleness);
  }
});

describe("getRecordV2Key", () => {
  test.each([
    {
      domain: "domain1",
      record: Record.SOL,
      expected: "GBrd6Q53eu1T2PiaQAtm92r3DwxmoGvZ2D6xjtVtN1Qt",
    },
    {
      domain: "sub.domain2",
      record: Record.SOL,
      expected: "A3EFmyCmK5rp73TdgLH8aW49PJ8SJw915arhydRZ6Sws",
    },
    {
      domain: "domain3",
      record: Record.Url,
      expected: "DMZmnjcAnUwSje4o2LGJhipCfNZ5b37GEbbkwbQBWEW1",
    },
    {
      domain: "sub.domain4",
      record: Record.Url,
      expected: "6o8JQ7vss6r9sw9GWNVugZktwfEJ67iUz6H63hhmg4sj",
    },
    {
      domain: "domain5",
      record: Record.IPFS,
      expected: "DQHeVmAj9Nz4uAn2dneEsgBZWcfhUqLdtbDcfWhGL47D",
    },
    {
      domain: "sub.domain6",
      record: Record.IPFS,
      expected: "Dj7tnTTaktrrmdtatRuLG3YdtGZk8XEBMb4w5WtCBHvr",
    },
  ])("$domain", (e) => {
    expect(getRecordV2Key(e.domain, e.record).toBase58()).toBe(e.expected);
  });
});

describe("Write APIs reject .sol domains", () => {
  test("createRecord rejects .sol domain", () => {
    expect(() =>
      createRecord("mydomain.sol", Record.Github, "value", key, key),
    ).toThrow(UnsupportedTldError);
  });

  test("updateRecord rejects .sol domain", () => {
    expect(() =>
      updateRecord("mydomain.sol", Record.Github, "value", key, key),
    ).toThrow(UnsupportedTldError);
  });

  test("deleteRecord rejects .sol domain", () => {
    expect(() => deleteRecord("mydomain.sol", Record.Github, key, key)).toThrow(
      UnsupportedTldError,
    );
  });

  test("setRecordStalenessVerifier rejects .sol domain", () => {
    expect(() =>
      setRecordStalenessVerifier("mydomain.sol", Record.Github, key, key, key),
    ).toThrow(UnsupportedTldError);
  });

  test("setRecordRoaVerifier rejects .sol domain", () => {
    expect(() =>
      setRecordRoaVerifier("mydomain.sol", Record.Github, key, key, key),
    ).toThrow(UnsupportedTldError);
  });

  test("validateRecordRoa rejects .sol domain", () => {
    expect(() =>
      validateRecordRoa("mydomain.sol", Record.Github, key, key, key),
    ).toThrow(UnsupportedTldError);
  });

  test("validateRecordRoaEthereum rejects .sol domain", () => {
    expect(() =>
      validateRecordRoaEthereum(
        "mydomain.sol",
        Record.ETH,
        key,
        key,
        Buffer.alloc(64),
        Buffer.alloc(20),
      ),
    ).toThrow(UnsupportedTldError);
  });
});
