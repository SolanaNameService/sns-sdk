import { expect, test } from "@jest/globals";
import { PublicKey } from "@solana/web3.js";

import { registerDomain } from "../../src/bindings/registerDomain";
import { registerDomainWithNft } from "../../src/bindings/registerDomainWithNft";
import { UnsupportedTldError } from "../../src/error";

const connection = {} as any;

test("registerDomainWithNft rejects .sol domain", () => {
  expect(() =>
    registerDomainWithNft(
      "mydomain.sol",
      1_000,
      PublicKey.default,
      PublicKey.default,
      PublicKey.default,
      PublicKey.default,
      PublicKey.default,
    ),
  ).toThrow(UnsupportedTldError);
});

test("registerDomain rejects .sol domain", async () => {
  await expect(
    registerDomain(
      connection,
      "mydomain.sol",
      1_000,
      PublicKey.default,
      PublicKey.default,
    ),
  ).rejects.toThrow(UnsupportedTldError);
});
