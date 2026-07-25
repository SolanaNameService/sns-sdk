import { expect, test } from "@jest/globals";
import { getSnsDomainKeySync } from "../../src/utils/getSnsDomainKeySync";

const items = [
  {
    domain: "bonfida",
    address: "Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb",
  },
  {
    domain: "dex.bonfida",
    address: "HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu",
  },
];

test("Derivation", () => {
  items.forEach((e) =>
    expect(getSnsDomainKeySync(e.domain).pubkey.toBase58()).toBe(e.address),
  );
});
