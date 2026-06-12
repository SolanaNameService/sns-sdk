import { expect, test } from "@jest/globals";
import { getDomainKeySync } from "../../src/utils/getDomainKeySync";

const items = [
  {
    domain: "bonfida.sns",
    address: "Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb",
  },
  {
    domain: "dex.bonfida.sns",
    address: "HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu",
  },
];

test("Derivation", () => {
  items.forEach((e) =>
    expect(getDomainKeySync(e.domain).pubkey.toBase58()).toBe(e.address),
  );
});
