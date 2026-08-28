import { describe, expect, jest, test } from "@jest/globals";
import { Address } from "@solana/kit";

import { getSolDomainsForAddress } from "../../src/address/getSolDomainsForAddress";
import { getSolNftsForAddress } from "../../src/address/getSolNftsForAddress";
import { getAllSolDomains } from "../../src/domain/getAllSolDomains";
import { getSolDomainAddress } from "../../src/domain/getSolDomainAddress";
import { TEST_RPC } from "../constants";

jest.setTimeout(60_000);

describe("SOL address discovery", () => {
  test.each([
    {
      address: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs" as Address,
      domains: ["sns-ip-5-wallet-1", "sns-ip-5-wallet-2"],
    },
    {
      address: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr" as Address,
      domains: ["sns-ip-5-wallet-3"],
    },
  ])("getSolDomainsForAddress($address)", async ({ address, domains }) => {
    const result = await getSolDomainsForAddress({ rpc: TEST_RPC, address });
    const names = result.map(({ domain }) => domain).sort();

    expect(names).toEqual(domains.sort());
    await Promise.all(
      result.map(async ({ domain, domainAddress }) => {
        await expect(getSolDomainAddress({ domain })).resolves.toMatchObject({
          domainAddress,
        });
      })
    );
  });

  test.each([
    {
      address: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr" as Address,
      domains: ["sns-ip-5-wallet-5"],
    },
    {
      address: "53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH" as Address,
      domains: ["sns-ip-5-wallet-7", "sns-ip-5-wallet-9"],
    },
  ])("getSolNftsForAddress($address)", async ({ address, domains }) => {
    const result = await getSolNftsForAddress({
      rpc: TEST_RPC,
      address,
    });

    expect(result.map(({ domain }) => domain).sort()).toEqual(domains.sort());
    for (const candidate of result) {
      expect(candidate.domainAddress).toMatch(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/);
      expect(candidate.mint).toMatch(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/);
    }
  });

  test("getAllSolDomains includes direct records and tokenized records", async () => {
    const result = await getAllSolDomains({ rpc: TEST_RPC });
    const walletOne = await getSolDomainAddress({
      domain: "sns-ip-5-wallet-1",
    });
    const walletTwo = await getSolDomainAddress({
      domain: "sns-ip-5-wallet-2",
    });

    expect(result).toEqual(
      expect.arrayContaining([
        {
          domainAddress: walletOne.domainAddress,
          owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs" as Address,
        },
        {
          domainAddress: walletTwo.domainAddress,
          owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs" as Address,
        },
      ])
    );
  });
});
