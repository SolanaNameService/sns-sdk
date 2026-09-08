import { describe, expect, jest, test } from "@jest/globals";

import { SYSTEM_PROGRAM_ADDRESS } from "../../src/constants/addresses";
import { ResolveOptions, resolve, safeResolve } from "../../src/domain/resolve";
import {
  DomainExpiredError,
  PdaOwnerNotAllowedError,
  SnsSolResolutionMismatchError,
} from "../../src/errors";
import { TEST_RPC } from "../constants";

jest.setTimeout(60_000);

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
describe("SOL domain reads", () => {
  describe("resolve", () => {
    test.each([
      {
        domain: "sns-ip-5-wallet-1.sol",
        result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-2.sol",
        result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-3.sol",
        result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
        options: {
          allowPda: true,
          programIds: [SYSTEM_PROGRAM_ADDRESS],
        } as ResolveOptions,
      },
      {
        domain: "sns-ip-5-wallet-5.sol",
        result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
        options: {
          allowPda: true,
          programIds: [SYSTEM_PROGRAM_ADDRESS],
        } as ResolveOptions,
      },
      {
        domain: "sns-ip-5-wallet-7.sol",
        result: "53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH",
      },
      {
        domain: "sns-ip-5-wallet-9.sol",
        result: "53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH",
      },
    ])("$domain resolves correctly", async (e) => {
      const resolvedValue = await resolve({
        rpc: TEST_RPC,
        domain: e.domain,
        options: e.options,
      });
      expect(resolvedValue.toString()).toBe(e.result);
    });

    test.each([
      {
        domain: "sns-ip-5-wallet-3.sol",
        error: PdaOwnerNotAllowedError,
      },
      {
        domain: "sns-ip-5-wallet-4.sol",
        error: DomainExpiredError,
      },
      {
        domain: "sns-ip-5-wallet-5.sol",
        error: PdaOwnerNotAllowedError,
      },
      {
        domain: "sns-ip-5-wallet-6.sol",
        error: DomainExpiredError,
      },
      {
        domain: "sns-ip-5-wallet-8.sol",
        error: DomainExpiredError,
      },
    ])("$domain throws expected error", async ({ domain, error }) => {
      await expect(resolve({ rpc: TEST_RPC, domain })).rejects.toThrow(error);
    });
  });

  describe("safeResolve", () => {
    test.each([
      {
        domain: "sns-ip-5-wallet-1.sol",
        result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-5.sol",
        result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
        options: {
          allowPda: true,
          programIds: [SYSTEM_PROGRAM_ADDRESS],
        } as ResolveOptions,
      },
      {
        domain: "sns-ip-5-wallet-7.sol",
        result: "53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH",
      },
    ])("$domain resolves correctly", async (e) => {
      const resolvedValue = await safeResolve({
        rpc: TEST_RPC,
        domain: e.domain,
        options: e.options,
      });
      expect(resolvedValue.toString()).toBe(e.result);
    });

    test.each([
      {
        domain: "sns-ip-5-wallet-2.sol",
        error: SnsSolResolutionMismatchError,
      },
      {
        domain: "sns-ip-5-wallet-4.sol",
        error: DomainExpiredError,
      },
      {
        domain: "sns-ip-5-wallet-5.sol",
        error: PdaOwnerNotAllowedError,
      },
      {
        domain: "sns-ip-5-wallet-6.sol",
        error: DomainExpiredError,
      },
      {
        domain: "sns-ip-5-wallet-8.sol",
        error: DomainExpiredError,
      },
      {
        domain: "sns-ip-5-wallet-9.sol",
        error: SnsSolResolutionMismatchError,
      },
    ])("$domain throws expected error", async ({ domain, error }) => {
      await expect(safeResolve({ rpc: TEST_RPC, domain })).rejects.toThrow(
        error
      );
    });
  });
});
