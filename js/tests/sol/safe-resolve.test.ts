require("dotenv").config();
import { test, jest, expect, describe } from "@jest/globals";
import { Connection, SystemProgram } from "@solana/web3.js";
import { safeResolve, type ResolveConfig } from "../../src/resolve";
import {
  DomainExpired,
  PdaOwnerNotAllowed,
  SnsSolResolutionMismatchError,
} from "../../src/error";

jest.setTimeout(50_000);

const connection = new Connection(process.env.RPC_URL!);

/**
 * On-chain fixtures for testing SRS-backed `.sol` resolution.
 *
 * Each `sns-ip-5-wallet-N.sol` fixture represents a specific combination of
 * record conditions as shown below:
 *
 * | sns-ip-5-wallet | tokenized | expired | pda owner | .sns mismatch |
 * |-----------------|-----------|---------|-----------|---------------|
 * | 1               | false     | false   | false     | false         |
 * | 2               | false     | false   | false     | true          |
 * | 3               | false     | false   | true      | true          |
 * | 4               | false     | true    | false     | false         |
 * | 5               | true      | false   | true      | false         |
 * | 6               | true      | true    | true      | true          |
 * | 7               | true      | false   | false     | false         |
 * | 8               | true      | true    | false     | false         |
 * | 9               | true      | false   | false     | true          |
 */
describe("safeResolve .sol domains", () => {
  test.each([
    {
      domain: "sns-ip-5-wallet-1.sol",
      result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
    },
    {
      domain: "sns-ip-5-wallet-5.sol",
      result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      config: {
        allowPda: true,
        programIds: [SystemProgram.programId],
      } as ResolveConfig,
    },
    {
      domain: "sns-ip-5-wallet-7.sol",
      result: "53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH",
    },
  ])("$domain safeResolves correctly", async ({ domain, config, result }) => {
    const resolvedValue = await safeResolve(connection, domain, config);
    expect(resolvedValue.toBase58()).toBe(result);
  });

  test.each([
    {
      domain: "sns-ip-5-wallet-2.sol",
      error: SnsSolResolutionMismatchError,
    },
    {
      domain: "sns-ip-5-wallet-4.sol",
      error: DomainExpired,
    },
    {
      domain: "sns-ip-5-wallet-5.sol",
      error: PdaOwnerNotAllowed,
    },
    {
      domain: "sns-ip-5-wallet-6.sol",
      error: DomainExpired,
    },
    {
      domain: "sns-ip-5-wallet-8.sol",
      error: DomainExpired,
    },
    {
      domain: "sns-ip-5-wallet-9.sol",
      error: SnsSolResolutionMismatchError,
    },
  ])("safeResolve $domain throws expected error", async ({ domain, error }) => {
    await expect(safeResolve(connection, domain)).rejects.toThrow(error);
  });
});
