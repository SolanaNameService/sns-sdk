require("dotenv").config();
import { test, jest, expect } from "@jest/globals";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { createSubdomain } from "../../src/bindings/createSubdomain";
import { transferSubdomain } from "../../src/bindings/transferSubdomain";
import { randomBytes } from "crypto";
import { VAULT_OWNER } from "../../src/constants";
import { findSubdomains } from "../../src/utils/findSubdomains";
import { getSnsDomainKeySync } from "../../src/utils/getSnsDomainKeySync";
import { resolve } from "../../src/resolve";
import { InvalidSubdomainError } from "../../src/error";

jest.setTimeout(20_000);

const connection = new Connection(process.env.RPC_URL!);

test("Create sub", async () => {
  const tx = new Transaction();
  const ix = await createSubdomain(
    connection,
    randomBytes(10).toString("hex") + ".bonfida.sns",
    new PublicKey("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v"),
    2_000,
  );
  tx.add(...ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = VAULT_OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Transfer sub", async () => {
  let tx = new Transaction();
  const owner = new PublicKey("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
  const parentOwner = new PublicKey(
    "Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v",
  );
  let ix = await transferSubdomain(
    connection,
    "test.bonfida.sns",
    PublicKey.default,
    false,
  );
  tx.add(ix);
  let blockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.recentBlockhash = blockhash;
  tx.feePayer = owner;
  let res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);

  tx = new Transaction();
  ix = await transferSubdomain(
    connection,
    "test.0x33.sns",
    PublicKey.default,
    true,
  );
  tx.add(ix);
  blockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.recentBlockhash = blockhash;
  tx.feePayer = parentOwner;
  res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Find sub domain", async () => {
  const subs = await findSubdomains(
    connection,
    getSnsDomainKeySync("67679").pubkey,
  );
  const expectedSub = ["bullish", "hollaaa", "testing"];
  subs.sort().forEach((e, idx) => expect(e).toBe(expectedSub[idx]));
});

test("Create sub - Fee payer", async () => {
  const sub = "gvbhnjklmjnhb";
  const parent = "bonfida.sns";
  const feePayer = VAULT_OWNER;

  const parentOwner = await resolve(connection, parent);
  const ix = await createSubdomain(
    connection,
    sub + "." + parent,
    parentOwner,
    1_000,
    feePayer,
  );
  const tx = new Transaction();
  tx.add(...ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = VAULT_OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("createSubdomain rejects top-level .sns input", async () => {
  await expect(
    createSubdomain(connection, "mydomain.sns", PublicKey.default),
  ).rejects.toThrow(InvalidSubdomainError);
});

test("createSubdomain rejects malformed .sns subdomain", async () => {
  await expect(
    createSubdomain(connection, "sub..sns", PublicKey.default),
  ).rejects.toThrow(InvalidSubdomainError);
});

test("transferSubdomain rejects top-level .sns input", async () => {
  await expect(
    transferSubdomain(connection, "mydomain.sns", PublicKey.default),
  ).rejects.toThrow(InvalidSubdomainError);
});

test("transferSubdomain rejects extra-label .sns input", async () => {
  await expect(
    transferSubdomain(connection, "sub.parent.extra.sns", PublicKey.default),
  ).rejects.toThrow(InvalidSubdomainError);
});
