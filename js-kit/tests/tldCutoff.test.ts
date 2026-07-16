import { describe, expect, jest, test } from "@jest/globals";
import type {
  GetAccountInfoApi,
  GetMultipleAccountsApi,
  GetProgramAccountsApi,
  GetSlotApi,
  GetTokenLargestAccountsApi,
  Rpc,
} from "@solana/kit";

import { SOL_TLD_CUTOFF_SLOT } from "../src/config";
import { getDomainOwner } from "../src/domain/getDomainOwner";
import { getDomainRecord } from "../src/domain/getDomainRecord";
import { getDomainRecords } from "../src/domain/getDomainRecords";
import { getSubdomains } from "../src/domain/getSubdomains";
import { resolve } from "../src/domain/resolve";
import { UnsupportedTldError } from "../src/errors";
import { verifyRecordRightOfAssociation } from "../src/record/verifyRecordRightOfAssociation";
import { verifyRecordStaleness } from "../src/record/verifyRecordStaleness";
import { Record } from "../src/types/record";
import { assertTldSupported } from "../src/utils/assertTldSupported";

type TestRpc = Rpc<
  GetAccountInfoApi &
    GetMultipleAccountsApi &
    GetProgramAccountsApi &
    GetSlotApi &
    GetTokenLargestAccountsApi
>;
type ReadCall = (rpc: TestRpc) => Promise<unknown>;

const createRpc = (slot: bigint | Error) => {
  const send = jest.fn(async () => {
    if (slot instanceof Error) throw slot;
    return slot;
  });
  const rpc = {
    getSlot: jest.fn(() => ({ send })),
    getAccountInfo: jest.fn(),
    getMultipleAccounts: jest.fn(),
    getProgramAccounts: jest.fn(),
    getTokenLargestAccounts: jest.fn(),
  } as unknown as TestRpc;

  return { rpc, send };
};

const postCutoffReadCases: [string, ReadCall][] = [
  ["resolve", (rpc) => resolve({ rpc, domain: "example.sol" })],
  ["getDomainOwner", (rpc) => getDomainOwner({ rpc, domain: "example.sol" })],
  [
    "getDomainRecord",
    (rpc) =>
      getDomainRecord({ rpc, domain: "example.sol", record: Record.SOL }),
  ],
  [
    "getDomainRecords",
    (rpc) =>
      getDomainRecords({
        rpc,
        domain: "example.sol",
        records: [Record.SOL],
      }),
  ],
  [
    "verifyRecordStaleness",
    (rpc) =>
      verifyRecordStaleness({
        rpc,
        domain: "example.sol",
        record: Record.SOL,
      }),
  ],
  [
    "verifyRecordRightOfAssociation",
    (rpc) => verifyRecordRightOfAssociation(rpc, "example.sol", Record.SOL),
  ],
  ["getSubdomains", (rpc) => getSubdomains({ rpc, domain: "example.sol" })],
];

const nestedReadCases: [string, ReadCall][] = [
  [
    "getDomainRecord",
    (rpc) =>
      getDomainRecord({ rpc, domain: "example.sol", record: Record.SOL }),
  ],
  [
    "getDomainRecords",
    (rpc) =>
      getDomainRecords({
        rpc,
        domain: "example.sol",
        records: [Record.SOL],
      }),
  ],
  [
    "verifyRecordStaleness",
    (rpc) =>
      verifyRecordStaleness({
        rpc,
        domain: "example.sol",
        record: Record.SOL,
      }),
  ],
];

describe("legacy .sol cutoff", () => {
  test(".sns and unsupported suffixes do not request a slot", async () => {
    const { rpc } = createRpc(0n);

    await expect(
      assertTldSupported({ rpc, domain: "example.sns" })
    ).resolves.toEqual(["example", ".sns"]);
    await expect(
      assertTldSupported({ rpc, domain: "example.com" })
    ).rejects.toThrow(UnsupportedTldError);
    expect(rpc.getSlot).not.toHaveBeenCalled();
  });

  test("allows only slots strictly below the cutoff", async () => {
    const before = createRpc(SOL_TLD_CUTOFF_SLOT - 1n);
    const at = createRpc(SOL_TLD_CUTOFF_SLOT);

    await expect(
      assertTldSupported({ rpc: before.rpc, domain: "example.sol" })
    ).resolves.toEqual(["example", ".sol"]);
    await expect(
      assertTldSupported({ rpc: at.rpc, domain: "example.sol" })
    ).rejects.toThrow(UnsupportedTldError);
  });

  test("does not cache pre-cutoff slots", async () => {
    const { rpc, send } = createRpc(SOL_TLD_CUTOFF_SLOT - 1n);

    await assertTldSupported({ rpc, domain: "example.sol" });
    await assertTldSupported({ rpc, domain: "example.sol" });
    expect(send).toHaveBeenCalledTimes(2);
    expect(rpc.getSlot).toHaveBeenCalledWith({ commitment: "finalized" });
  });

  test("caches only confirmed post-cutoff RPC clients", async () => {
    const first = createRpc(SOL_TLD_CUTOFF_SLOT);
    const second = createRpc(SOL_TLD_CUTOFF_SLOT - 1n);

    await expect(
      assertTldSupported({
        rpc: first.rpc,
        domain: "example.sol",
      })
    ).rejects.toThrow(UnsupportedTldError);
    await expect(
      assertTldSupported({
        rpc: first.rpc,
        domain: "example.sol",
      })
    ).rejects.toThrow(UnsupportedTldError);
    await expect(
      assertTldSupported({
        rpc: second.rpc,
        domain: "example.sol",
      })
    ).resolves.toEqual(["example", ".sol"]);
    expect(first.send).toHaveBeenCalledTimes(1);
    expect(second.send).toHaveBeenCalledTimes(1);
  });

  test("propagates and does not cache slot RPC failures", async () => {
    const failure = new Error("slot unavailable");
    const { rpc, send } = createRpc(failure);

    await expect(
      assertTldSupported({ rpc, domain: "example.sol" })
    ).rejects.toBe(failure);
    await expect(
      assertTldSupported({ rpc, domain: "example.sol" })
    ).rejects.toBe(failure);
    expect(send).toHaveBeenCalledTimes(2);
  });

  test.each(postCutoffReadCases)(
    "%s rejects before account RPCs",
    async (_name, call) => {
      const { rpc, send } = createRpc(SOL_TLD_CUTOFF_SLOT);

      await expect(call(rpc)).rejects.toThrow(UnsupportedTldError);
      expect(send).toHaveBeenCalledTimes(1);
      expect(rpc.getAccountInfo).not.toHaveBeenCalled();
      expect(rpc.getMultipleAccounts).not.toHaveBeenCalled();
      expect(rpc.getProgramAccounts).not.toHaveBeenCalled();
      expect(rpc.getTokenLargestAccounts).not.toHaveBeenCalled();
    }
  );

  test("local verifier length errors precede the cutoff request", async () => {
    const { rpc } = createRpc(SOL_TLD_CUTOFF_SLOT);
    const records = [Record.SOL];
    const verifiers = [undefined, undefined];

    await expect(
      getDomainRecords({
        rpc,
        domain: "example.sol",
        records,
        options: { verifiers },
      })
    ).rejects.toThrow("The number of verifiers must be the same");
    expect(rpc.getSlot).not.toHaveBeenCalled();
  });

  test.each(nestedReadCases)(
    "%s checks a pre-cutoff slot only once",
    async (_name, call) => {
      const { rpc, send } = createRpc(SOL_TLD_CUTOFF_SLOT - 1n);

      await expect(call(rpc)).rejects.toThrow();
      expect(send).toHaveBeenCalledTimes(1);
    }
  );
});
