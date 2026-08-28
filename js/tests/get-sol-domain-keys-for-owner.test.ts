require("dotenv").config();

import { describe, expect, jest, test } from "@jest/globals";
import { Connection, PublicKey } from "@solana/web3.js";

import { getSolDomainKeysForOwner } from "../src/utils/getSolDomainKeysForOwner";
import { getSolDomainKeySync } from "../src/utils/getSolDomainKeySync";

jest.setTimeout(50_000);

const connection = new Connection(process.env.RPC_URL!);

describe("getSolDomainKeysForOwner", () => {
  test.each([
    {
      owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      domains: ["sns-ip-5-wallet-1", "sns-ip-5-wallet-2"],
    },
    {
      owner: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      domains: ["sns-ip-5-wallet-3"],
    },
    {
      owner: "53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH",
      domains: [],
    },
  ])(
    "returns non-expired domain keys for $owner",
    async ({ owner, domains }) => {
      const result = await getSolDomainKeysForOwner(
        connection,
        new PublicKey(owner),
      );
      const expectedKeys = domains
        .map((domain) => getSolDomainKeySync(domain).pubkey.toBase58())
        .sort();

      expect(result.map((key) => key.toBase58()).sort()).toEqual(expectedKeys);
    },
  );
});
