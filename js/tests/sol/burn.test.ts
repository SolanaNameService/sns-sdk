import { expect, test } from "@jest/globals";
import { PublicKey } from "@solana/web3.js";

import { UnsupportedTldError } from "../../src/error";
import { burnDomain } from "../../src/bindings/burnDomain";

const owner = PublicKey.default;
const target = new PublicKey("3Wnd5Df69KitZfUoPYZU438eFRNwGHkhLnSAWL65PxJX");

test("burnDomain rejects .sol domain", () => {
  expect(() => burnDomain("mydomain.sol", owner, target)).toThrow(
    UnsupportedTldError,
  );
});
