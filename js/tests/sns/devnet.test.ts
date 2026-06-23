require("dotenv").config();
import { test, jest, expect } from "@jest/globals";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { NATIVE_MINT, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { devnet } from "../../src/devnet";
import { randomBytes } from "crypto";
import { Record } from "../../src/types/record";

jest.setTimeout(20_000);

// Use custom devnet rpc if rate limited
const connection = new Connection(
  process.env.RPC_URL_DEVNET || "https://api.devnet.solana.com",
);

const OWNER = new PublicKey("3f9fRjLaDSDVxd26xMEm4WuSXv62cGt5qVfEVGwMfTz6");
const OWNER2 = new PublicKey("DjXsn34uz8hnC4KLiSkEVNmzqX5ZFP2Q7aErTBH8LWxe");
const OWNER3 = new PublicKey("3DdZkHbt2rHDzKSNPK9ApQCwhA6anDKUzuWoCooie6oJ");

test("Registration", async () => {
  const tx = new Transaction();
  const ix = await devnet.bindings.registerDomain(
    connection,
    randomBytes(10).toString("hex") + ".sns",
    1_000,
    OWNER2,
    getAssociatedTokenAddressSync(NATIVE_MINT, OWNER2, true),
    NATIVE_MINT,
  );
  tx.add(...ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER2;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Burn", async () => {
  const tx = new Transaction();
  const ix = devnet.bindings.burnDomain("devnet-test-1.sns", OWNER, OWNER);
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Create sub", async () => {
  const sub = "gvbhnjklmjnhb";
  const parent = "devnet-test-1.sns";
  const tx = new Transaction();
  const ix = await devnet.bindings.createSubdomain(
    connection,
    sub + "." + parent,
    OWNER,
    2_000,
  );
  tx.add(...ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = devnet.constants.VAULT_OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Transfer domain", async () => {
  const tx = new Transaction();
  const ix = await devnet.bindings.transferDomain(
    connection,
    "devnet-test-1.sns",
    OWNER2,
  );
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Transfer subdomain", async () => {
  const tx = new Transaction();
  const ix = await devnet.bindings.transferSubdomain(
    connection,
    "subdomain-test.devnet-test-1.sns",
    OWNER2,
  );
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Set primary", async () => {
  const domain = "devnet-test-1.sns";
  const { pubkey: nameAccount } = devnet.utils.getDomainKeySync(domain);
  const tx = new Transaction();
  const ix = await devnet.bindings.setPrimaryDomain(
    connection,
    nameAccount,
    OWNER,
  );
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Set record", async () => {
  const domain = "devnet-test-1.sns";
  const tx = new Transaction();
  const ix = await devnet.bindings.createRecord(
    domain,
    Record.Discord,
    "ilovedotso",
    OWNER,
    OWNER,
  );
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Set RoA verifier", async () => {
  const domain = "dotsofan22.sns";
  const tx = new Transaction();
  const ix = devnet.bindings.setRecordRoaVerifier(
    domain,
    Record.SOL,
    OWNER3,
    OWNER3,
    OWNER3,
  );
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER3;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Validate Record RoA", async () => {
  const domain = "dotsofan22.sns";
  const tx = new Transaction();
  const ix = devnet.bindings.validateRecordRoa(
    domain,
    Record.SOL,
    OWNER3,
    OWNER3,
    OWNER3,
  );
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER3;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Update Record", async () => {
  const domain = "dotsofan22.sns";
  const tx = new Transaction();
  const ix = devnet.bindings.updateRecord(
    domain,
    Record.Telegram,
    "iLoveDotso",
    OWNER3,
    OWNER3,
  );
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER3;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Delete Record", async () => {
  const domain = "dotsofan22.sns";
  const tx = new Transaction();
  const ix = devnet.bindings.deleteRecord(
    domain,
    Record.Telegram,
    OWNER3,
    OWNER3,
  );
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER3;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});
