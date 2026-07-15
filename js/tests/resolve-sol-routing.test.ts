import { describe, expect, jest, test } from "@jest/globals";
import { Connection } from "@solana/web3.js";

import { SOL_TLD_CUTOFF_SLOT } from "../src/config";
import { UnsupportedTldError } from "../src/error";
import { resolve } from "../src/resolve";

let endpointId = 0;

const createConnection = (slot: number) => {
  const getSlot = jest.fn(async () => slot);
  const getMultipleAccountsInfo = jest.fn(async () => {
    throw new Error("legacy resolver called");
  });
  const connection = {
    rpcEndpoint: `https://resolve-${endpointId++}.example.com`,
    getSlot,
    getMultipleAccountsInfo,
  } as unknown as Connection;

  return { connection, getSlot, getMultipleAccountsInfo };
};

describe(".sol resolution routing", () => {
  test("uses legacy resolution before the cutoff", async () => {
    const { connection, getSlot, getMultipleAccountsInfo } = createConnection(
      SOL_TLD_CUTOFF_SLOT - 1,
    );

    await expect(resolve(connection, "legacy.sol")).rejects.toThrow(
      "legacy resolver called",
    );
    expect(getSlot).toHaveBeenCalledWith("finalized");
    expect(getMultipleAccountsInfo).toHaveBeenCalledTimes(1);
  });

  test("rejects .sol at the cutoff before legacy account reads", async () => {
    const { connection, getSlot, getMultipleAccountsInfo } =
      createConnection(SOL_TLD_CUTOFF_SLOT);

    await expect(resolve(connection, "disabled.sol")).rejects.toThrow(
      UnsupportedTldError,
    );
    expect(getSlot).toHaveBeenCalledWith("finalized");
    expect(getMultipleAccountsInfo).not.toHaveBeenCalled();
  });

  test("routes .sns directly to legacy resolution without a slot request", async () => {
    const { connection, getSlot, getMultipleAccountsInfo } =
      createConnection(SOL_TLD_CUTOFF_SLOT);

    await expect(resolve(connection, "domain.sns")).rejects.toThrow(
      "legacy resolver called",
    );
    expect(getSlot).not.toHaveBeenCalled();
    expect(getMultipleAccountsInfo).toHaveBeenCalledTimes(1);
  });

  test("rejects unsupported TLDs without RPC", async () => {
    const { connection, getSlot, getMultipleAccountsInfo } =
      createConnection(SOL_TLD_CUTOFF_SLOT);

    await expect(resolve(connection, "domain.xyz")).rejects.toThrow(
      UnsupportedTldError,
    );
    expect(getSlot).not.toHaveBeenCalled();
    expect(getMultipleAccountsInfo).not.toHaveBeenCalled();
  });
});
