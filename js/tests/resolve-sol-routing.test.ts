import { describe, expect, jest, test } from "@jest/globals";
import { Connection } from "@solana/web3.js";

import { UnsupportedTldError } from "../src/error";
import { resolve } from "../src/resolve";

let endpointId = 0;

const createConnection = () => {
  const getSlot = jest.fn();
  const getAccountInfo = jest.fn(async () => {
    throw new Error("srs resolver called");
  });
  const getMultipleAccountsInfo = jest.fn(async () => {
    throw new Error("legacy resolver called");
  });
  const connection = {
    rpcEndpoint: `https://resolve-${endpointId++}.example.com`,
    getSlot,
    getAccountInfo,
    getMultipleAccountsInfo,
  } as unknown as Connection;

  return { connection, getSlot, getAccountInfo, getMultipleAccountsInfo };
};

describe(".sol resolution routing", () => {
  test("routes .sol directly to legacy resolution without a slot request", async () => {
    const { connection, getSlot, getMultipleAccountsInfo } = createConnection();

    await expect(resolve(connection, "domain.sol")).rejects.toThrow(
      "srs resolver called",
    );
    expect(getSlot).not.toHaveBeenCalled();
    expect(getMultipleAccountsInfo).not.toHaveBeenCalled();
  });

  test("routes .sns directly to legacy resolution without a slot request", async () => {
    const { connection, getSlot, getMultipleAccountsInfo } = createConnection();

    await expect(resolve(connection, "domain.sns")).rejects.toThrow(
      "legacy resolver called",
    );
    expect(getSlot).not.toHaveBeenCalled();
    expect(getMultipleAccountsInfo).toHaveBeenCalledTimes(1);
  });

  test("rejects unsupported TLDs without RPC", async () => {
    const { connection, getSlot, getMultipleAccountsInfo } = createConnection();

    await expect(resolve(connection, "domain.xyz")).rejects.toThrow(
      UnsupportedTldError,
    );
    expect(getSlot).not.toHaveBeenCalled();
    expect(getMultipleAccountsInfo).not.toHaveBeenCalled();
  });
});
