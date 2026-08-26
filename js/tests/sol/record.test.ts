require("dotenv").config();
import { describe, expect, jest, test } from "@jest/globals";
import { Connection, PublicKey } from "@solana/web3.js";

import { createRecord } from "../../src/bindings/createRecord";
import { deleteRecord } from "../../src/bindings/deleteRecord";
import { setRecordRoaVerifier } from "../../src/bindings/setRecordRoaVerifier";
import { setRecordStalenessVerifier } from "../../src/bindings/setRecordStalenessVerifier";
import { updateRecord } from "../../src/bindings/updateRecord";
import { validateRecordRoa } from "../../src/bindings/validateRecordRoa";
import { validateRecordRoaEthereum } from "../../src/bindings/validateRecordRoaEthereum";
import { UnsupportedTldError } from "../../src/error";
import { getMultipleRecords } from "../../src/record/getMultipleRecords";
import { getRecord } from "../../src/record/getRecord";
import { verifyRightOfAssociation } from "../../src/record/verifyRightOfAssociation";
import { verifyStaleness } from "../../src/record/verifyStaleness";
import { Record } from "../../src/types/record";

jest.setTimeout(50_000);

const key = PublicKey.default;
const connection = new Connection(process.env.RPC_URL!);
describe("Read APIs reject .sol domains", () => {
  test("getRecord rejects .sol domain", async () => {
    const domain = "wallet-guide-9.sol";
    await expect(
      getRecord(connection, domain, Record.Url, {
        deserialize: true,
      }),
    ).rejects.toThrow(UnsupportedTldError);
  });

  test("getMultipleRecords rejects .sol domain", async () => {
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
    await expect(
      getMultipleRecords(
        connection,
        domain,
        items.map((e) => e.record),
        { deserialize: true },
      ),
    ).rejects.toThrow(UnsupportedTldError);
  });

  test("verifyStaleness rejects .sol domain", async () => {
    await expect(
      verifyStaleness(connection, Record.Github, "mydomain.sol"),
    ).rejects.toThrow(UnsupportedTldError);
  });

  test("verifyRightOfAssociation rejects.sol domain", async () => {
    await expect(
      verifyRightOfAssociation(
        connection,
        Record.Github,
        "mydomain.sol",
        Buffer.alloc(32),
      ),
    ).rejects.toThrow(UnsupportedTldError);
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
