require("dotenv").config();

import { describe, expect, jest, test } from "@jest/globals";
import { Connection, PublicKey } from "@solana/web3.js";

import { getSolDomainsForOwner } from "../src/utils/getSolDomainsForOwner";

jest.setTimeout(50_000);

const connection = new Connection(process.env.RPC_URL!);

describe("getSolDomainsForOwner", () => {
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
  ])("returns non-expired domains for $owner", async ({ owner, domains }) => {
    const result = await getSolDomainsForOwner(
      connection,
      new PublicKey(owner),
    );

    expect(result.map(({ domain }) => domain).sort()).toEqual(
      [...domains].sort(),
    );
  });
});
