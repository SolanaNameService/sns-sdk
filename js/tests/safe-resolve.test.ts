import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Connection, Keypair } from "@solana/web3.js";

jest.mock("../src/config", () => ({
  ...jest.requireActual<typeof import("../src/config")>("../src/config"),
  SOL_SRS_RESOLUTION_ENABLED: true,
}));
jest.mock("../src/resolve/resolveSns", () => ({ resolveSns: jest.fn() }));
jest.mock("../src/resolve/resolveSol", () => ({ resolveSol: jest.fn() }));

import { ErrorType, SnsSolResolutionMismatchError } from "../src/error";
import { safeResolve } from "../src/resolve";
import { resolveSns } from "../src/resolve/resolveSns";
import { resolveSol } from "../src/resolve/resolveSol";

const connection = {} as Connection;
const mockedResolveSns = jest.mocked(resolveSns);
const mockedResolveSol = jest.mocked(resolveSol);

describe("safeResolve", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns the target when SRS and SNS resolution match", async () => {
    const target = Keypair.generate().publicKey;
    mockedResolveSol.mockResolvedValue(target);
    mockedResolveSns.mockResolvedValue(target);

    await expect(safeResolve(connection, "domain.sol")).resolves.toEqual(
      target,
    );
    expect(mockedResolveSol).toHaveBeenCalledWith(connection, "domain", {
      allowPda: false,
    });
    expect(mockedResolveSns).toHaveBeenCalledWith(connection, "domain", {
      allowPda: false,
    });
  });

  test("rejects conflicting SRS and SNS targets", async () => {
    const srsTarget = Keypair.generate().publicKey;
    const snsTarget = Keypair.generate().publicKey;
    mockedResolveSol.mockResolvedValue(srsTarget);
    mockedResolveSns.mockResolvedValue(snsTarget);
    const result = safeResolve(connection, "domain.sol");

    await expect(result).rejects.toEqual(
      expect.objectContaining({
        type: ErrorType.SnsSolResolutionMismatch,
        message: `SRS resolved domain.sol to ${srsTarget.toBase58()}, but SNS resolved it to ${snsTarget.toBase58()}`,
      }),
    );
    await expect(result).rejects.toBeInstanceOf(SnsSolResolutionMismatchError);
  });
});
