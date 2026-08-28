require("dotenv").config();

import { describe, expect, jest, test } from "@jest/globals";
import { Connection, PublicKey } from "@solana/web3.js";

import { getSolNftsForOwner } from "../src/utils/getSolNftsForOwner";

jest.setTimeout(50_000);

const connection = new Connection(process.env.RPC_URL!);

describe("getSolNftsForOwner", () => {
  test.each([
    {
      owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      domains: [],
    },
    {
      owner: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      domains: ["sns-ip-5-wallet-5"],
    },
    {
      owner: "53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH",
      domains: ["sns-ip-5-wallet-7", "sns-ip-5-wallet-9"],
    },
  ])(
    "returns non-expired tokenized domains for $owner",
    async ({ owner, domains }) => {
      const result = await getSolNftsForOwner(connection, new PublicKey(owner));

      expect(result.map(({ domain }) => domain).sort()).toEqual(
        [...domains].sort(),
      );
    },
  );
});
