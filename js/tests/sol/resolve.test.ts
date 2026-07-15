require("dotenv").config();
import { test, jest, expect, describe } from "@jest/globals";
import { Connection, SystemProgram } from "@solana/web3.js";
import { resolve, type ResolveConfig } from "../../src/resolve";
import { PdaOwnerNotAllowed, WrongValidation } from "../../src/error";

jest.setTimeout(50_000);

const connection = new Connection(process.env.RPC_URL!);

describe("resolve .sol domains", () => {
  test.each([
    {
      domain: "sns-ip-5-wallet-1.sol",
      result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
    },
    {
      domain: "sns-ip-5-wallet-2.sol",
      result: "AxwzQXhZNJb9zLyiHUQA12L2GL7CxvUNrp6neee6r3cA",
    },
    {
      domain: "sns-ip-5-wallet-4.sol",
      result: "7PLHHJawDoa4PGJUK3mUnusV7SEVwZwEyV5csVzm86J4",
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
      domain: "sns-ip-5-wallet-5.sol",
      result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      config: { allowPda: "any" } as ResolveConfig,
    },
    {
      domain: "sns-ip-5-wallet-7.sol",
      result: "53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH",
      config: undefined,
    },
    {
      domain: "sns-ip-5-wallet-8.sol",
      result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      config: undefined,
    },
    {
      domain: "sns-ip-5-wallet-9.sol",
      result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
    },
    {
      domain: "sns-ip-5-wallet-10.sol",
      result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      config: {
        allowPda: true,
        programIds: [SystemProgram.programId],
      } as ResolveConfig,
    },
    {
      domain: "sns-ip-5-wallet-10.sol",
      result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      config: { allowPda: "any" } as ResolveConfig,
    },
  ])("$domain resolves correctly", async (e) => {
    const resolvedValue = await resolve(connection, e.domain, e?.config);
    expect(resolvedValue.toBase58()).toBe(e.result);
  });

  test.each([
    {
      domain: "sns-ip-5-wallet-3.sol",
      error: WrongValidation,
    },
    {
      domain: "sns-ip-5-wallet-6.sol",
      error: PdaOwnerNotAllowed,
    },
    {
      domain: "sns-ip-5-wallet-11.sol",
      error: PdaOwnerNotAllowed,
    },
    {
      domain: "sns-ip-5-wallet-12.sol",
      error: WrongValidation,
    },
  ])("$domain throws expected error", async ({ domain, error }) => {
    await expect(resolve(connection, domain)).rejects.toThrow(error);
  });

  test.each([
    {
      domain: "wallet-guide-5.sol",
      owner: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
    },
    {
      domain: "wallet-guide-4.sol",
      owner: "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ",
    },
    {
      domain: "wallet-guide-3.sol",
      owner: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
    },
    {
      domain: "wallet-guide-2.sol",
      owner: "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4",
    },
    {
      domain: "wallet-guide-1.sol",
      owner: "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4",
    },
    {
      domain: "wallet-guide-0.sol",
      owner: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
    },
    {
      domain: "sub-0.wallet-guide-3.sol",
      owner: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
    },
    {
      domain: "sub-1.wallet-guide-3.sol",
      owner: "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ",
    },
    // Record V2
    {
      domain: "wallet-guide-6.sol",
      owner: "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ",
    },
    {
      domain: "wallet-guide-8.sol",
      owner: "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4",
    },
  ])("$domain resolves correctly (backward compatibility)", async (e) => {
    const resolvedValue = await resolve(connection, e.domain);
    expect(resolvedValue.toBase58()).toBe(e.owner);
  });
});
