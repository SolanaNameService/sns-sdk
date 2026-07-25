import { expect, test } from "@jest/globals";
import { PublicKey } from "@solana/web3.js";

import { UnsupportedTldError } from "../src/error";
import { transferDomain } from "../src/bindings/transferDomain";

const connection = {} as any;

test("transferDomain rejects bare domain", async () => {
  await expect(
    transferDomain(connection, "mydomain", PublicKey.default),
  ).rejects.toThrow(UnsupportedTldError);
});
