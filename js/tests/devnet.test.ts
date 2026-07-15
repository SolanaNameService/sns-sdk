require("dotenv").config();
import { test, jest, expect } from "@jest/globals";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { devnet } from "../src/devnet";
import { NameRegistryState } from "../src/state";

jest.setTimeout(20_000);

// Use custom devnet rpc if rate limited
const connection = new Connection(
  process.env.RPC_URL_DEVNET || "https://api.devnet.solana.com",
);

const OWNER = new PublicKey("3f9fRjLaDSDVxd26xMEm4WuSXv62cGt5qVfEVGwMfTz6");
const OWNER2 = new PublicKey("3DdZkHbt2rHDzKSNPK9ApQCwhA6anDKUzuWoCooie6oJ");

test("Create", async () => {
  const tx = new Transaction();
  const lamports = await connection.getMinimumBalanceForRentExemption(
    1_000 + NameRegistryState.HEADER_LEN,
  );
  const ix = await devnet.bindings.createNameRegistry(
    connection,
    "devnet-test-create",
    1_000,
    OWNER,
    OWNER,
    lamports,
  );
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Create reverse", async () => {
  const tx = new Transaction();
  const { pubkey: subkey } = devnet.utils._deriveSync(
    "devnet-test-create-reverse",
  );
  const ix = await devnet.bindings.createReverse(
    subkey,
    "devnet-test-create-reverse",
    OWNER,
  );
  tx.add(...ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Delete", async () => {
  const tx = new Transaction();
  const ix = await devnet.bindings.deleteNameRegistry(
    connection,
    "devnet-test-1",
    OWNER,
  );
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Update", async () => {
  const tx = new Transaction();
  const ix = await devnet.bindings.updateNameRegistry(
    connection,
    "devnet-test-1",
    0,
    Buffer.from("testing-data"),
  );
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});

test("Get primary", async () => {
  const { reverse: primaryDomain } = await devnet.utils.getPrimaryDomain(
    connection,
    OWNER2,
  );
  expect(primaryDomain).toBe("dotsofan22");
});
