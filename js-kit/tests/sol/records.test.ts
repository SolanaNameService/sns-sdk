import { describe, expect, jest, test } from "@jest/globals";

import { getDomainOwner } from "../../src/domain/getDomainOwner";
import { getDomainRecord } from "../../src/domain/getDomainRecord";
import { getDomainRecords } from "../../src/domain/getDomainRecords";
import { getSubdomains } from "../../src/domain/getSubdomains";
import { UnsupportedTldError } from "../../src/errors";
import { verifyRecordRightOfAssociation } from "../../src/record/verifyRecordRightOfAssociation";
import { verifyRecordStaleness } from "../../src/record/verifyRecordStaleness";
import { Record } from "../../src/types/record";
import { TEST_RPC } from "../constants";

jest.setTimeout(5_000);

describe("SOL record reads", () => {
  test.each([
    [
      "getDomainOwner",
      () => getDomainOwner({ rpc: {} as never, domain: "example.sol" }),
    ],
    [
      "getDomainRecord",
      () =>
        getDomainRecord({
          rpc: {} as never,
          domain: "example.sol",
          record: Record.SOL,
        }),
    ],
    [
      "getDomainRecords",
      () =>
        getDomainRecords({
          rpc: {} as never,
          domain: "example.sol",
          records: [Record.SOL],
        }),
    ],
    [
      "getSubdomains",
      () => getSubdomains({ rpc: {} as never, domain: "example.sol" }),
    ],
  ])("%s rejects before account RPCs", async (_name, call) => {
    await expect(call()).rejects.toThrow(UnsupportedTldError);
  });

  test("verifyRecordRightOfAssociation rejects .sol domain", async () => {
    await expect(
      verifyRecordRightOfAssociation(
        TEST_RPC,
        "sns-ip-5-wallet-1.sol",
        Record.SOL
      )
    ).rejects.toThrow(UnsupportedTldError);
  });

  test("verifyRecordStaleness rejects .sol domain", async () => {
    await expect(
      verifyRecordStaleness({
        rpc: TEST_RPC,
        domain: "sns-ip-5-wallet-1.sol",
        record: Record.SOL,
      })
    ).rejects.toThrow(UnsupportedTldError);
  });
});
