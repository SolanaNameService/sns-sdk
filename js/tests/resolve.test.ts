require("dotenv").config();
import { test, jest, expect, describe } from "@jest/globals";
import { Connection } from "@solana/web3.js";
import { resolve } from "../src/resolve";
import { UnsupportedTldError } from "../src/error";

jest.setTimeout(50_000);

const connection = new Connection(process.env.RPC_URL!);

describe("resolve - input validation", () => {
  test("throws UnsupportedTldError on bare name", async () => {
    await expect(resolve(connection, "mydomain")).rejects.toThrow(
      UnsupportedTldError,
    );
  });

  test("throws UnsupportedTldError on unsupported TLD", async () => {
    await expect(resolve(connection, "mydomain.com")).rejects.toThrow(
      UnsupportedTldError,
    );
  });
});
