import { describe, expect, jest, test } from "@jest/globals";

import { UnsupportedTldError } from "../src/errors";
import { getRecordV1Address } from "../src/record/getRecordV1Address";
import { getRecordV2Address } from "../src/record/getRecordV2Address";
import { verifyRecordRightOfAssociation } from "../src/record/verifyRecordRightOfAssociation";
import { verifyRecordStaleness } from "../src/record/verifyRecordStaleness";
import { Record } from "../src/types/record";
import { TEST_RPC } from "./constants";

jest.setTimeout(5_000);

describe("Record input policy", () => {
  test("getRecordV1Address rejects bare domains", async () => {
    await expect(
      getRecordV1Address({ domain: "sns-ip-5-wallet-1", record: Record.SOL })
    ).rejects.toThrow(UnsupportedTldError);
  });

  test("getRecordV2Address rejects bare domains", async () => {
    await expect(
      getRecordV2Address({ domain: "sns-ip-5-wallet-1", record: Record.SOL })
    ).rejects.toThrow(UnsupportedTldError);
  });

  test("verifyRecordRightOfAssociation rejects bare domains", async () => {
    await expect(
      verifyRecordRightOfAssociation(TEST_RPC, "sns-ip-5-wallet-1", Record.SOL)
    ).rejects.toThrow(UnsupportedTldError);
  });

  test("verifyRecordStaleness rejects bare domains", async () => {
    await expect(
      verifyRecordStaleness({
        rpc: TEST_RPC,
        domain: "sns-ip-5-wallet-1",
        record: Record.SOL,
      })
    ).rejects.toThrow(UnsupportedTldError);
  });
});
