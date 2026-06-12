import { expect, test } from "@jest/globals";

import { UnsupportedTldError } from "../src/error";
import { getDomainKeySync } from "../src/utils/getDomainKeySync";

test("Derivation - throws on bare name", () => {
  expect(() => getDomainKeySync("bonfida")).toThrow(UnsupportedTldError);
});

test("Derivation - .sns produces identical keys to .sol", () => {
  // Both strip to the same bare label and route through SNS derivation.
  // This pins the cross-TLD equivalence so a future routing change is caught.
  expect(getDomainKeySync("bonfida.sns").pubkey.toBase58()).toBe(
    getDomainKeySync("bonfida.sol").pubkey.toBase58(),
  );
  expect(getDomainKeySync("dex.bonfida.sns").pubkey.toBase58()).toBe(
    getDomainKeySync("dex.bonfida.sol").pubkey.toBase58(),
  );
});

test("Derivation - .sns namespace split classification", () => {
  // "alice.sns" → strip .sns → "alice" (1 label) → top-level domain, not a sub
  const topLevel = getDomainKeySync("alice.sns");
  expect(topLevel.isSub).toBe(false);
  expect(topLevel.parent).toBeUndefined();

  // "sub.alice.sns" → strip .sns → "sub.alice" (2 labels) → subdomain of alice
  const sub = getDomainKeySync("sub.alice.sns");
  expect(sub.isSub).toBe(true);
  expect(sub.parent).toBeDefined();
});
