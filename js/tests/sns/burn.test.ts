require("dotenv").config();
import { test, jest, expect } from "@jest/globals";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { burnDomain } from "../../src/bindings/burnDomain";

jest.setTimeout(20_000);

const connection = new Connection(process.env.RPC_URL!);

const OWNER = new PublicKey("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");

const BURN_DST = new PublicKey("3Wnd5Df69KitZfUoPYZU438eFRNwGHkhLnSAWL65PxJX");

test("Burn .sns domain", async () => {
  const tx = new Transaction();
  const ix = burnDomain("bonfida.sns", OWNER, BURN_DST);
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});
