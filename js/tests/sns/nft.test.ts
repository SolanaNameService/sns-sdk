import { describe, expect, test } from "@jest/globals";
import { getDomainKeySync } from "../../src/utils/getDomainKeySync";
import { getDomainMint } from "../../src/nft/getDomainMint";

describe("getDomainMint", () => {
  test.each([
    {
      domain: "domain1.sns",
      address: "3YTxXhhVue9BVjgjPwJbbJ4uGPsnwN453DDf72rYE5WN",
    },
    {
      domain: "sub.domain2.sns",
      address: "66CnogoXDBqYeYRGYzQf19VyrMnB4uGxpZQDuDYfbKCX",
    },
  ])("$domain", (e) => {
    expect(getDomainMint(getDomainKeySync(e.domain).pubkey).toBase58()).toBe(
      e.address,
    );
  });
});
