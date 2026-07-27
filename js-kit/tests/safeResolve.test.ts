import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Address } from "@solana/kit";

import { ResolveParams, safeResolve } from "../src/domain/resolve";
import { resolveSns } from "../src/domain/resolveSns";
import { resolveSol } from "../src/domain/resolveSol";
import { ErrorType, SnsSolResolutionMismatchError } from "../src/errors";

jest.mock("../src/config", () => ({
  ...jest.requireActual<typeof import("../src/config")>("../src/config"),
  SOL_SRS_RESOLUTION_ENABLED: true,
}));
jest.mock("../src/domain/resolveSns", () => ({ resolveSns: jest.fn() }));
jest.mock("../src/domain/resolveSol", () => ({ resolveSol: jest.fn() }));

const rpc = {} as ResolveParams["rpc"];
const mockedResolveSns = jest.mocked(resolveSns);
const mockedResolveSol = jest.mocked(resolveSol);
const srsTarget = "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs" as Address;
const snsTarget = "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4" as Address;

describe("safeResolve", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns the target when SRS and SNS resolution match", async () => {
    mockedResolveSol.mockResolvedValue(srsTarget);
    mockedResolveSns.mockResolvedValue(srsTarget);

    await expect(safeResolve({ rpc, domain: "domain.sol" })).resolves.toBe(
      srsTarget
    );
    expect(mockedResolveSol).toHaveBeenCalledWith({
      rpc,
      domain: "domain",
      options: { allowPda: false },
    });
    expect(mockedResolveSns).toHaveBeenCalledWith({
      rpc,
      domain: "domain",
      options: { allowPda: false },
    });
  });

  test("rejects conflicting SRS and SNS targets", async () => {
    mockedResolveSol.mockResolvedValue(srsTarget);
    mockedResolveSns.mockResolvedValue(snsTarget);
    const result = safeResolve({ rpc, domain: "domain.sol" });

    await expect(result).rejects.toEqual(
      expect.objectContaining({
        type: ErrorType.SnsSolResolutionMismatch,
        message: `SRS resolved domain.sol to ${srsTarget}, but SNS resolved it to ${snsTarget}`,
      })
    );
    await expect(result).rejects.toBeInstanceOf(SnsSolResolutionMismatchError);
  });

  test("uses ordinary resolution for an SNS domain", async () => {
    mockedResolveSns.mockResolvedValue(snsTarget);

    await expect(safeResolve({ rpc, domain: "domain.sns" })).resolves.toBe(
      snsTarget
    );
    expect(mockedResolveSns).toHaveBeenCalledWith({
      rpc,
      domain: "domain",
      options: { allowPda: false },
    });
    expect(mockedResolveSol).not.toHaveBeenCalled();
  });
});
