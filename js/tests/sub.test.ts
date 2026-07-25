import { expect, test } from "@jest/globals";
import { PublicKey } from "@solana/web3.js";

import { UnsupportedTldError } from "../src/error";
import { createSubdomain } from "../src/bindings/createSubdomain";
import { transferSubdomain } from "../src/bindings/transferSubdomain";

const connection = {} as any;
const owner = PublicKey.default;

test("createSubdomain rejects bare/no-TLD input", async () => {
  await expect(
    createSubdomain(connection, "sub.mydomain", owner),
  ).rejects.toThrow(UnsupportedTldError);
});

test("transferSubdomain rejects bare/no-TLD input", async () => {
  await expect(
    transferSubdomain(connection, "sub.mydomain", owner),
  ).rejects.toThrow(UnsupportedTldError);
});
