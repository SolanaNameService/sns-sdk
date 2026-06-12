require("dotenv").config();
import { Connection } from "@solana/web3.js";
import { test, expect, jest } from "@jest/globals";
import { getAllRegisteredSnsDomains } from "../../src/utils/getAllRegisteredSnsDomains";

jest.setTimeout(4 * 60_000);

const connection = new Connection(process.env.RPC_URL!);

test("All registered", async () => {
  const registered = await getAllRegisteredSnsDomains(connection);
  expect(registered.length).toBeGreaterThan(130_000);
});
