require("dotenv").config();
import { test, jest, expect } from "@jest/globals";
import { Connection, PublicKey } from "@solana/web3.js";
import { registerDomain } from "../src/bindings/registerDomain";
import { registerDomainWithNft } from "../src/bindings/registerDomainWithNft";
import { UnsupportedTldError } from "../src/error";

jest.setTimeout(20_000);
jest.retryTimes(3);

const connection = new Connection(process.env.RPC_URL!);

test("Register with NFT rejects bare domain", () => {
  expect(() =>
    registerDomainWithNft(
      "mydomain",
      1_000,
      PublicKey.default,
      PublicKey.default,
      PublicKey.default,
      PublicKey.default,
      PublicKey.default,
      PublicKey.default,
      PublicKey.default,
    ),
  ).toThrow(UnsupportedTldError);
});

test("Register domain rejects bare domain", async () => {
  await expect(
    registerDomain(
      connection,
      "mydomain",
      1_000,
      PublicKey.default,
      PublicKey.default,
    ),
  ).rejects.toThrow(UnsupportedTldError);
});
