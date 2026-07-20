import { describe, expect, jest, test } from "@jest/globals";

import { UnsupportedTldError } from "../src/errors";
import { verifyRecordRightOfAssociation } from "../src/record/verifyRecordRightOfAssociation";
import { verifyRecordStaleness } from "../src/record/verifyRecordStaleness";
import { Record } from "../src/types/record";
import { TEST_RPC } from "./constants";

jest.setTimeout(5_000);

describe("Record input policy", () => {
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
