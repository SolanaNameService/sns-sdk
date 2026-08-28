import { expect, test } from "@jest/globals";
import { getSolDomainKeySync } from "../../src/utils/getSolDomainKeySync";

const items = [
  {
    domain: "sns-ip-5-wallet-1",
    address: "5aJnvSs3K5J1eFS1cemYHWnUeWp3QjKThWh5mWbGBgkt",
  },
  {
    domain: "sns-ip-5-wallet-2",
    address: "2gN2aGXi9kRnkXewWsshKTUWairEvMapA3z1EaqFqwMd",
  },
];

test("Derivation", () => {
  items.forEach((e) =>
    expect(getSolDomainKeySync(e.domain).pubkey.toBase58()).toBe(e.address),
  );
});
