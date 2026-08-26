import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Connection, Keypair } from "@solana/web3.js";

jest.mock("../../src/resolve/resolveSns", () => ({
  resolveSns: jest.fn(),
}));

import { safeResolve } from "../../src/resolve";
import { resolveSns } from "../../src/resolve/resolveSns";

const connection = {} as Connection;
const mockedResolveSns = jest.mocked(resolveSns);

describe("safeResolve .sns domains", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("delegates .sns resolution to resolveSns", async () => {
    const target = Keypair.generate().publicKey;
    const config = { allowPda: "any" } as const;
    mockedResolveSns.mockResolvedValue(target);

    await expect(
      safeResolve(connection, "domain.sns", config),
    ).resolves.toEqual(target);
    expect(mockedResolveSns).toHaveBeenCalledWith(connection, "domain", config);
  });
});
