require("dotenv").config();
import { test, jest, expect } from "@jest/globals";
import { Connection } from "@solana/web3.js";
import { findSubdomains } from "../../src/utils/findSubdomains";
import { getDomainKeySync } from "../../src/utils/getDomainKeySync";

jest.setTimeout(20_000);

const connection = new Connection(process.env.RPC_URL!);

test("Find sub domain", async () => {
  const subs = await findSubdomains(
    connection,
    getDomainKeySync("67679.sol").pubkey,
  );
  const expectedSub = ["bullish", "hollaaa", "testing"];
  subs.sort().forEach((e, idx) => expect(e).toBe(expectedSub[idx]));
});
