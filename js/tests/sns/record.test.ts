require("dotenv").config();
import { describe, expect, jest, test } from "@jest/globals";
import { getMultipleRecords } from "../../src/record/getMultipleRecords";
import { getRecord } from "../../src/record/getRecord";
import { getRecordV2Key } from "../../src/record/getRecordV2Key";
import { Record } from "../../src/types/record";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { createRecord } from "../../src/bindings/createRecord";
import { deleteRecord } from "../../src/bindings/deleteRecord";
import { setRecordRoaVerifier } from "../../src/bindings/setRecordRoaVerifier";
import { setRecordStalenessVerifier } from "../../src/bindings/setRecordStalenessVerifier";
import { updateRecord } from "../../src/bindings/updateRecord";
import { validateRecordRoa } from "../../src/bindings/validateRecordRoa";
import { validateRecordRoaEthereum } from "../../src/bindings/validateRecordRoaEthereum";
import { InvalidDomainError } from "../../src/error";

jest.setTimeout(50_000);

const connection = new Connection(process.env.RPC_URL!);

test("Create record", async () => {
  const domain = "wallet-guide-9.sns";
  const owner = new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
  const ix = createRecord(
    domain,
    Record.Github,
    "SolanaNameService",
    owner,
    owner,
  );
  const tx = new Transaction().add(ix);
  tx.feePayer = owner;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  const { value } = await connection.simulateTransaction(tx);
  expect(value.err).toBe(null);
});

test("Update record", async () => {
  const domain = "wallet-guide-9.sns";
  const owner = new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
  const tx = new Transaction();
  const ix_1 = createRecord(
    domain,
    Record.Github,
    "SolanaNameService",
    owner,
    owner,
  );
  tx.add(ix_1);
  const ix_2 = updateRecord(domain, Record.Github, "some text", owner, owner);
  tx.add(ix_2);
  tx.feePayer = owner;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  const { value } = await connection.simulateTransaction(tx);
  expect(value.err).toBe(null);
});

test("Delete record", async () => {
  const domain = "wallet-guide-9.sns";
  const owner = new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
  const tx = new Transaction();
  const ix_1 = createRecord(
    domain,
    Record.Github,
    "SolanaNameService",
    owner,
    owner,
  );
  tx.add(ix_1);
  const ix_2 = deleteRecord(domain, Record.Github, owner, owner);
  tx.add(ix_2);
  tx.feePayer = owner;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  const { value } = await connection.simulateTransaction(tx);
  expect(value.err).toBe(null);
});

test("Set record staleness verifier", async () => {
  const domain = "wallet-guide-9.sns";
  const owner = new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
  const tx = new Transaction();
  const ix_1 = createRecord(
    domain,
    Record.Github,
    "SolanaNameService",
    owner,
    owner,
  );
  tx.add(ix_1);
  const ix_2 = setRecordStalenessVerifier(
    domain,
    Record.Github,
    owner,
    owner,
    owner,
  );
  tx.add(ix_2);
  tx.feePayer = owner;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  const { value } = await connection.simulateTransaction(tx);
  expect(value.err).toBe(null);
});

test("ETH Verify", async () => {
  const domain = "wallet-guide-9.sns";
  const owner = new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
  // Record key: E4MZzSfkf59UVFYVux5WEufghvWxUktf6e5EaUuDExAc
  const tx = new Transaction();
  const ix_1 = createRecord(
    domain,
    Record.ETH,
    "0x4bfbfd1e018f9f27eeb788160579daf7e2cd7da7",
    owner,
    owner,
  );
  tx.add(ix_1);
  const ix_2 = setRecordStalenessVerifier(
    domain,
    Record.ETH,
    owner,
    owner,
    owner,
  );
  tx.add(ix_2);
  const ix_3 = validateRecordRoaEthereum(
    domain,
    Record.ETH,
    owner,
    owner,
    Buffer.from([
      78, 235, 200, 2, 51, 5, 225, 127, 83, 156, 25, 226, 53, 239, 196, 189,
      196, 197, 121, 2, 91, 2, 99, 11, 31, 179, 5, 233, 52, 246, 137, 252, 72,
      27, 67, 15, 86, 42, 62, 117, 140, 223, 159, 142, 86, 227, 233, 185, 149,
      111, 92, 122, 147, 23, 217, 1, 66, 72, 63, 150, 27, 219, 152, 10, 28,
    ]),
    Buffer.from([
      75, 251, 253, 30, 1, 143, 159, 39, 238, 183, 136, 22, 5, 121, 218, 247,
      226, 205, 125, 167,
    ]),
  );
  tx.add(ix_3);
  tx.feePayer = owner;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  const { value } = await connection.simulateTransaction(tx);
  expect(value.err).toBe(null);
});

test("Set RoA verifier", async () => {
  const domain = "wallet-guide-9.sns";
  const owner = new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
  const tx = new Transaction();
  const ix_1 = createRecord(
    domain,
    Record.Github,
    "SolanaNameService",
    owner,
    owner,
  );
  tx.add(ix_1);
  const ix_2 = setRecordRoaVerifier(domain, Record.Github, owner, owner, owner);
  tx.add(ix_2);
  tx.feePayer = owner;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  const { value } = await connection.simulateTransaction(tx);
  expect(value.err).toBe(null);
});

test("Create record for sub", async () => {
  const domain = "sub-0.wallet-guide-9.sns";
  const owner = new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
  const ix = createRecord(
    domain,
    Record.Github,
    "SolanaNameService",
    owner,
    owner,
  );
  const tx = new Transaction().add(ix);
  tx.feePayer = owner;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  const { value } = await connection.simulateTransaction(tx);
  expect(value.err).toBe(null);
});

test("Create record for sub & update & verify staleness & delete", async () => {
  const domain = "sub-0.wallet-guide-9.sns";
  const owner = new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
  const tx = new Transaction();
  tx.add(
    createRecord(domain, Record.Github, "SolanaNameService", owner, owner),
  );
  tx.add(updateRecord(domain, Record.Github, "somethingelse", owner, owner));
  tx.add(
    setRecordStalenessVerifier(domain, Record.Github, owner, owner, owner),
  );
  tx.add(deleteRecord(domain, Record.Github, owner, owner));
  tx.feePayer = owner;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  const { value } = await connection.simulateTransaction(tx);
  expect(value.err).toBe(null);
});

test("getRecord", async () => {
  const domain = "wallet-guide-9.sns";
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
  const domain = "wallet-guide-9.sns";
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
      domain: "domain1.sns",
      record: Record.SOL,
      expected: "GBrd6Q53eu1T2PiaQAtm92r3DwxmoGvZ2D6xjtVtN1Qt",
    },
    {
      domain: "sub.domain2.sns",
      record: Record.SOL,
      expected: "A3EFmyCmK5rp73TdgLH8aW49PJ8SJw915arhydRZ6Sws",
    },
    {
      domain: "domain3.sns",
      record: Record.Url,
      expected: "DMZmnjcAnUwSje4o2LGJhipCfNZ5b37GEbbkwbQBWEW1",
    },
    {
      domain: "sub.domain4.sns",
      record: Record.Url,
      expected: "6o8JQ7vss6r9sw9GWNVugZktwfEJ67iUz6H63hhmg4sj",
    },
    {
      domain: "domain5.sns",
      record: Record.IPFS,
      expected: "DQHeVmAj9Nz4uAn2dneEsgBZWcfhUqLdtbDcfWhGL47D",
    },
    {
      domain: "sub.domain6.sns",
      record: Record.IPFS,
      expected: "Dj7tnTTaktrrmdtatRuLG3YdtGZk8XEBMb4w5WtCBHvr",
    },
  ])("$domain", (e) => {
    expect(getRecordV2Key(e.domain, e.record).toBase58()).toBe(e.expected);
  });
});

describe(".sns record APIs reject malformed .sns shapes", () => {
  const owner = PublicKey.default;

  test("createRecord rejects extra-label .sns input", () => {
    expect(() =>
      createRecord(
        "a.b.c.sns",
        Record.Github,
        "SolanaNameService",
        owner,
        owner,
      ),
    ).toThrow(InvalidDomainError);
  });

  test("updateRecord rejects extra-label .sns input", () => {
    expect(() =>
      updateRecord("a.b.c.sns", Record.Github, "value", owner, owner),
    ).toThrow(InvalidDomainError);
  });

  test("deleteRecord rejects extra-label .sns input", () => {
    expect(() =>
      deleteRecord("a.b.c.sns", Record.Github, owner, owner),
    ).toThrow(InvalidDomainError);
  });

  test("setRecordStalenessVerifier rejects extra-label .sns input", () => {
    expect(() =>
      setRecordStalenessVerifier(
        "a.b.c.sns",
        Record.Github,
        owner,
        owner,
        owner,
      ),
    ).toThrow(InvalidDomainError);
  });

  test("setRecordRoaVerifier rejects extra-label .sns input", () => {
    expect(() =>
      setRecordRoaVerifier("a.b.c.sns", Record.Github, owner, owner, owner),
    ).toThrow(InvalidDomainError);
  });

  test("validateRecordRoa rejects extra-label .sns input", () => {
    expect(() =>
      validateRecordRoa("a.b.c.sns", Record.Github, owner, owner, owner),
    ).toThrow(InvalidDomainError);
  });

  test("validateRecordRoaEthereum rejects extra-label .sns input", () => {
    expect(() =>
      validateRecordRoaEthereum(
        "a.b.c.sns",
        Record.ETH,
        owner,
        owner,
        Buffer.alloc(64),
        Buffer.alloc(20),
      ),
    ).toThrow(InvalidDomainError);
  });
});
