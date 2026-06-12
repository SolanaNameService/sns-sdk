require("dotenv").config();
import { test, expect, jest } from "@jest/globals";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { registerFavorite } from "../../src/bindings/registerFavorite";
import { getDomainKeySync } from "../../src/utils/getDomainKeySync";

jest.setTimeout(10_000);

const connection = new Connection(process.env.RPC_URL!);

test("Register fav", async () => {
  const owner = new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
  const tx = new Transaction();
  const ix = await registerFavorite(
    connection,
    getDomainKeySync("wallet-guide-3.sns").pubkey,
    owner,
  );
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = owner;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});
