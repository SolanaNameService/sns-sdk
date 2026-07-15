import { describe, expect, jest, test } from "@jest/globals";
import { Connection } from "@solana/web3.js";

import { SOL_SRS_RESOLUTION_ENABLED, SOL_TLD_CUTOFF_SLOT } from "../src/config";
import { MissingVerifierError, UnsupportedTldError } from "../src/error";
import { getMultipleRecords } from "../src/record/getMultipleRecords";
import { getRecord } from "../src/record/getRecord";
import { verifyRightOfAssociation } from "../src/record/verifyRightOfAssociation";
import { verifyStaleness } from "../src/record/verifyStaleness";
import { Record } from "../src/types/record";
import { assertTldSupported } from "../src/utils/assertTldSupported";
import { SNS_TLD, SOL_TLD, SUPPORTED_TLDS } from "../src/utils/tld";

let endpointId = 0;

const createConnection = (slot: number) => {
  const getSlot = jest.fn(async () => slot);
  const getAccountInfo = jest.fn();
  const getMultipleAccountsInfo = jest.fn();
  const connection = {
    rpcEndpoint: `https://mainnet-${endpointId++}.example.com`,
    getSlot,
    getAccountInfo,
    getMultipleAccountsInfo,
  } as unknown as Connection;

  return { connection, getSlot, getAccountInfo, getMultipleAccountsInfo };
};

describe("TLD support", () => {
  test("matches static support to the SRS resolution configuration", () => {
    expect(SUPPORTED_TLDS).toEqual(
      SOL_SRS_RESOLUTION_ENABLED ? [SNS_TLD] : [SNS_TLD, SOL_TLD],
    );
  });

  test("accepts .sns without requesting the slot", async () => {
    const { connection, getSlot } = createConnection(SOL_TLD_CUTOFF_SLOT);

    await expect(assertTldSupported(connection, "domain.sns")).resolves.toEqual(
      ["domain", ".sns"],
    );
    expect(getSlot).not.toHaveBeenCalled();
  });

  test("rejects unsupported suffixes without requesting the slot", async () => {
    const { connection, getSlot } = createConnection(SOL_TLD_CUTOFF_SLOT);

    await expect(assertTldSupported(connection, "domain.xyz")).rejects.toThrow(
      UnsupportedTldError,
    );
    expect(getSlot).not.toHaveBeenCalled();
  });

  test("does not cache pre-cutoff slots", async () => {
    const { connection, getSlot } = createConnection(SOL_TLD_CUTOFF_SLOT - 1);

    await assertTldSupported(connection, "domain.sol");
    await assertTldSupported(connection, "domain.sol");

    expect(getSlot).toHaveBeenCalledTimes(2);
    expect(getSlot).toHaveBeenNthCalledWith(1, "finalized");
    expect(getSlot).toHaveBeenNthCalledWith(2, "finalized");
  });

  test("permanently caches a post-cutoff endpoint", async () => {
    const { connection, getSlot } = createConnection(SOL_TLD_CUTOFF_SLOT);

    await expect(assertTldSupported(connection, "domain.sol")).rejects.toThrow(
      UnsupportedTldError,
    );
    await expect(assertTldSupported(connection, "domain.sol")).rejects.toThrow(
      UnsupportedTldError,
    );

    expect(getSlot).toHaveBeenCalledTimes(1);
    expect(getSlot).toHaveBeenCalledWith("finalized");
  });

  test("isolates the cache by RPC endpoint", async () => {
    const first = createConnection(SOL_TLD_CUTOFF_SLOT);
    const second = createConnection(SOL_TLD_CUTOFF_SLOT - 1);

    await expect(
      assertTldSupported(first.connection, "domain.sol"),
    ).rejects.toThrow(UnsupportedTldError);
    await expect(
      assertTldSupported(second.connection, "domain.sol"),
    ).resolves.toEqual(["domain", ".sol"]);

    expect(first.getSlot).toHaveBeenCalledTimes(1);
    expect(second.getSlot).toHaveBeenCalledTimes(1);
  });

  test("does not cache RPC failures", async () => {
    const rpcError = new Error("RPC unavailable");
    const getSlot = jest
      .fn<() => Promise<number>>()
      .mockRejectedValueOnce(rpcError)
      .mockResolvedValueOnce(SOL_TLD_CUTOFF_SLOT - 1);
    const connection = {
      rpcEndpoint: `https://mainnet-${endpointId++}.example.com`,
      getSlot,
    } as unknown as Connection;

    await expect(assertTldSupported(connection, "domain.sol")).rejects.toBe(
      rpcError,
    );
    await expect(assertTldSupported(connection, "domain.sol")).resolves.toEqual(
      ["domain", ".sol"],
    );

    expect(getSlot).toHaveBeenCalledTimes(2);
  });
});

describe("TLD support in read APIs", () => {
  const readApis: Array<
    [string, (connection: Connection) => Promise<unknown>]
  > = [
    [
      "getRecord",
      (connection) => getRecord(connection, "domain.sol", Record.Github),
    ],
    [
      "getMultipleRecords",
      (connection) =>
        getMultipleRecords(connection, "domain.sol", [Record.Github]),
    ],
    [
      "verifyStaleness",
      (connection) => verifyStaleness(connection, Record.Github, "domain.sol"),
    ],
    [
      "verifyRightOfAssociation",
      (connection) =>
        verifyRightOfAssociation(
          connection,
          Record.Github,
          "domain.sol",
          Buffer.alloc(32),
        ),
    ],
  ];

  test.each(readApis)(
    "%s rejects before account RPCs",
    async (_name, invoke) => {
      const { connection, getSlot, getAccountInfo, getMultipleAccountsInfo } =
        createConnection(SOL_TLD_CUTOFF_SLOT);

      await expect(invoke(connection)).rejects.toThrow(UnsupportedTldError);

      expect(getSlot).toHaveBeenCalledTimes(1);
      expect(getAccountInfo).not.toHaveBeenCalled();
      expect(getMultipleAccountsInfo).not.toHaveBeenCalled();
    },
  );

  test("validates a missing verifier before requesting the slot", async () => {
    const { connection, getSlot, getAccountInfo } =
      createConnection(SOL_TLD_CUTOFF_SLOT);

    await expect(
      verifyRightOfAssociation(connection, Record.Github, "domain.sol"),
    ).rejects.toThrow(MissingVerifierError);

    expect(getSlot).not.toHaveBeenCalled();
    expect(getAccountInfo).not.toHaveBeenCalled();
  });
});
