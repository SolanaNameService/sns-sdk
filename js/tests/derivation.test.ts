import { expect, test } from "@jest/globals";

import { InvalidInputError } from "../src/error";
import { getSnsDomainKeySync } from "../src/utils/getSnsDomainKeySync";

test("Derivation - derives known SNS namespace keys", () => {
  expect(getSnsDomainKeySync("bonfida").pubkey.toBase58()).toBe(
    "Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb",
  );
  expect(getSnsDomainKeySync("dex.bonfida").pubkey.toBase58()).toBe(
    "HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu",
  );
});

test("Derivation - .sns namespace split classification", () => {
  // "alice.sns" → strip .sns → "alice" (1 label) → top-level domain, not a sub
  const topLevel = getSnsDomainKeySync("alice");
  expect(topLevel.isSub).toBe(false);
  expect(topLevel.parent).toBeUndefined();

  // "sub.alice.sns" → strip .sns → "sub.alice" (2 labels) → subdomain of alice
  const sub = getSnsDomainKeySync("sub.alice");
  expect(sub.isSub).toBe(true);
  expect(sub.parent).toBeDefined();
});

test("Derivation - rejects unsupported nesting", () => {
  expect(() => getSnsDomainKeySync("deep.sub.alice")).toThrow(
    InvalidInputError,
  );
});
