import { describe, expect, jest, test } from "@jest/globals";

import { getAllSnsDomains } from "../src/domain/getAllSnsDomains";
import { getDomainAddress } from "../src/domain/getDomainAddress";
import { resolve } from "../src/domain/resolve";
import { InvalidInputError, UnsupportedTldError } from "../src/errors";
import { TEST_RPC } from "./constants";

jest.setTimeout(60_000);

describe("Domain input policy", () => {
  describe("getDomainAddress", () => {
    test.each(["sns-ip-5-wallet-1", "sns-ip-5-wallet-1.com"])(
      "%s throws UnsupportedTldError",
      async (domain) => {
        await expect(getDomainAddress({ domain })).rejects.toThrow(
          UnsupportedTldError
        );
      }
    );

    test("malformed supported domain throws InvalidInputError", async () => {
      await expect(getDomainAddress({ domain: "a.b.c.sns" })).rejects.toThrow(
        InvalidInputError
      );
    });
  });

  describe("resolve", () => {
    test.each(["sns-ip-5-wallet-1", "sns-ip-5-wallet-1.com"])(
      "%s throws UnsupportedTldError",
      async (domain) => {
        await expect(resolve({ rpc: TEST_RPC, domain })).rejects.toThrow(
          UnsupportedTldError
        );
      }
    );
  });
});

describe("Registered domain listing", () => {
  test("getAllSnsDomains returns registered SNS root domains", async () => {
    const registered = await getAllSnsDomains({ rpc: TEST_RPC });
    expect(registered.length).toBeGreaterThan(250_000);
  });
});
