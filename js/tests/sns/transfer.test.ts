import { expect, test } from "@jest/globals";
import { PublicKey } from "@solana/web3.js";

import { InvalidDomainError } from "../../src/error";
import { transferDomain } from "../../src/bindings/transferDomain";

const connection = {} as any;

test("transferDomain rejects subdomain .sns input", async () => {
  await expect(
    transferDomain(connection, "sub.mydomain.sns", PublicKey.default),
  ).rejects.toThrow(InvalidDomainError);
});
