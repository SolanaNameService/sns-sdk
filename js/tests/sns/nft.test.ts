import { describe, expect, test } from "@jest/globals";
import { getSnsDomainKeySync } from "../../src/utils/getSnsDomainKeySync";
import { getDomainMint } from "../../src/nft/getDomainMint";

describe("getDomainMint", () => {
  test.each([
    {
      domain: "domain1",
      address: "3YTxXhhVue9BVjgjPwJbbJ4uGPsnwN453DDf72rYE5WN",
    },
    {
      domain: "sub.domain2",
      address: "66CnogoXDBqYeYRGYzQf19VyrMnB4uGxpZQDuDYfbKCX",
    },
  ])("$domain", (e) => {
    expect(getDomainMint(getSnsDomainKeySync(e.domain).pubkey).toBase58()).toBe(
      e.address,
    );
  });
});
