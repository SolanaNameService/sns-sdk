import { describe, expect, jest, test } from "@jest/globals";
import {
  Address,
  Instruction,
  appendTransactionMessageInstructions,
  compileTransaction,
  createTransactionMessage,
  getBase64EncodedWireTransaction,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/kit";
import { randomBytes } from "crypto";

import { burnDomain } from "../src/bindings/burnDomain";
import { createNameRegistry } from "../src/bindings/createNameRegistry";
import { createRecord } from "../src/bindings/createRecord";
import { createReverse } from "../src/bindings/createReverse";
import { createSubdomain } from "../src/bindings/createSubdomain";
import { deleteNameRegistry } from "../src/bindings/deleteNameRegistry";
import { deleteRecord } from "../src/bindings/deleteRecord";
import { registerDomain } from "../src/bindings/registerDomain";
import { registerDomainWithNft } from "../src/bindings/registerDomainWithNft";
import { setPrimaryDomain } from "../src/bindings/setPrimaryDomain";
import { transferDomain } from "../src/bindings/transferDomain";
import { transferSubdomain } from "../src/bindings/transferSubdomain";
import { updateNameRegistry } from "../src/bindings/updateNameRegistry";
import { updateRecord } from "../src/bindings/updateRecord";
import {
  SNS_ROOT_DOMAIN_ACCOUNT,
  USDC_MINT,
  VAULT_OWNER,
} from "../src/constants/addresses";
import { getDomainAddress } from "../src/domain/getDomainAddress";
import {
  InvalidDomainError,
  InvalidSubdomainError,
  UnsupportedTldError,
} from "../src/errors";
import { RegistryState } from "../src/states/registry";
import { Record } from "../src/types/record";
import { TEST_RPC } from "./constants";

jest.setTimeout(30_000);

const testInstructions = async (ixs: Instruction[], payer: Address) => {
  const { value: latestBlockhash } = await TEST_RPC.getLatestBlockhash().send();

  const encodedWireTransaction = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(payer, tx),
    (tx) => appendTransactionMessageInstructions(ixs, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    compileTransaction,
    getBase64EncodedWireTransaction
  );

  const res = await TEST_RPC.simulateTransaction(encodedWireTransaction, {
    encoding: "base64",
    sigVerify: false,
  }).send();

  expect(res.value.err).toBe(null);
};

describe("Bindings", () => {
  describe("raw registry helpers", () => {
    describe("createNameRegistry", () => {
      const domain = randomBytes(10).toString("hex");
      test(domain, async () => {
        const space = 2000;
        const owner = "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8" as Address;
        const lamports = await TEST_RPC.getMinimumBalanceForRentExemption(
          BigInt(space + RegistryState.HEADER_LEN)
        ).send();

        const ixs: Instruction[] = [];
        ixs.push(
          await createNameRegistry({
            rpc: TEST_RPC,
            name: domain,
            space,
            payer: owner,
            owner,
            lamports,
          })
        );
        await testInstructions(ixs, owner);
      });
    });

    describe("updateNameRegistry", () => {
      test("wallet-guide-9", async () => {
        const domain = "wallet-guide-9";
        const owner = "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8" as Address;

        const ixs: Instruction[] = [];
        ixs.push(
          await updateNameRegistry({
            rpc: TEST_RPC,
            domain,
            offset: 0,
            data: Uint8Array.from("test data"),
            classAddress: undefined,
            parentAddress: SNS_ROOT_DOMAIN_ACCOUNT,
          })
        );

        await testInstructions(ixs, owner);
      });
    });

    describe("deleteNameRegistry", () => {
      test("wallet-guide-9", async () => {
        const owner = "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8" as Address;

        const ixs: Instruction[] = [];
        ixs.push(
          await deleteNameRegistry({
            rpc: TEST_RPC,
            name: "wallet-guide-9",
            refundAddress: owner,
            classAddress: undefined,
            parentAddress: SNS_ROOT_DOMAIN_ACCOUNT,
          })
        );

        await testInstructions(ixs, owner);
      });
    });

    describe("createReverse", () => {
      const domain = randomBytes(10).toString("hex");
      test(domain, async () => {
        const { domainAddress } = await getDomainAddress({
          domain: `${domain}.sns`,
        });
        const owner = "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8" as Address;

        const ixs: Instruction[] = [];
        ixs.push(await createReverse({ domainAddress, domain, payer: owner }));

        await testInstructions(ixs, owner);
      });
    });
  });

  describe("address-only bindings", () => {
    describe("setPrimaryDomain", () => {
      test("domain [wallet-guide-9.sns]", async () => {
        const domain = "wallet-guide-9.sns";
        const domainAddress = (await getDomainAddress({ domain }))
          .domainAddress;
        const owner = "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8" as Address;

        const ixs: Instruction[] = [];
        ixs.push(
          await setPrimaryDomain({ rpc: TEST_RPC, domainAddress, owner })
        );

        await testInstructions(ixs, owner);
      });

      test("subdomain [sub-0.wallet-guide-9.sns]", async () => {
        const domain = "sub-0.wallet-guide-9.sns";
        const domainAddress = (await getDomainAddress({ domain }))
          .domainAddress;
        const owner = "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8" as Address;

        const ixs: Instruction[] = [];
        ixs.push(
          await setPrimaryDomain({ rpc: TEST_RPC, domainAddress, owner })
        );

        await testInstructions(ixs, owner);
      });
    });
  });

  describe("write input policy", () => {
    const owner = "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8" as Address;
    const newOwner = "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs" as Address;

    test.each(["wallet-guide-9.sol", "wallet-guide-9", "wallet-guide-9.com"])(
      "registerDomain rejects %s",
      async (domain) => {
        await expect(
          registerDomain({
            rpc: TEST_RPC,
            domain,
            space: 1_000,
            buyer: VAULT_OWNER,
            buyerTokenAccount: VAULT_OWNER,
            mint: USDC_MINT,
          })
        ).rejects.toThrow(UnsupportedTldError);
      }
    );

    test.each(["sub.wallet-guide-9.sns", ".sns", "Wallet.sns"])(
      "registerDomain rejects malformed domain %s",
      async (domain) => {
        await expect(
          registerDomain({
            rpc: TEST_RPC,
            domain,
            space: 1_000,
            buyer: VAULT_OWNER,
            buyerTokenAccount: VAULT_OWNER,
            mint: USDC_MINT,
          })
        ).rejects.toThrow(InvalidDomainError);
      }
    );

    test("registerDomainWithNft rejects malformed domain", async () => {
      await expect(
        registerDomainWithNft({
          domain: ".sns",
          space: 1_000,
          buyer: owner,
          nftSource: owner,
          nftMint: owner,
        })
      ).rejects.toThrow(InvalidDomainError);
    });

    test.each(["wallet-guide-9.sol", "wallet-guide-9", "wallet-guide-9.com"])(
      "transferDomain rejects %s",
      async (domain) => {
        await expect(
          transferDomain({ rpc: TEST_RPC, domain, newOwner })
        ).rejects.toThrow(UnsupportedTldError);
      }
    );

    test.each(["sub.wallet-guide-9.sns", ".sns", "Wallet.sns"])(
      "transferDomain rejects malformed domain %s",
      async (domain) => {
        await expect(
          transferDomain({
            rpc: TEST_RPC,
            domain,
            newOwner,
          })
        ).rejects.toThrow(InvalidDomainError);
      }
    );

    test("burnDomain rejects malformed domain", async () => {
      await expect(
        burnDomain({
          domain: ".sns",
          owner,
          refundAddress: owner,
        })
      ).rejects.toThrow(InvalidDomainError);
    });

    test.each([".sns", ".wallet-guide-9.sns", "sub..sns", "Sub.wallet.sns"])(
      "createSubdomain rejects malformed domain %s",
      async (subdomain) => {
        await expect(
          createSubdomain({
            rpc: TEST_RPC,
            subdomain,
            owner,
          })
        ).rejects.toThrow(InvalidDomainError);
      }
    );

    test.each(["a.b.c.sns", "Sub.wallet.sns"])(
      "transferSubdomain rejects malformed domain %s",
      async (subdomain) => {
        await expect(
          transferSubdomain({
            rpc: TEST_RPC,
            subdomain,
            newOwner,
          })
        ).rejects.toThrow(InvalidSubdomainError);
      }
    );

    test.each([".sns", "wallet..sns", "a.b.c.sns", "Wallet.sns"])(
      "createRecord rejects malformed domain %s",
      async (domain) => {
        await expect(
          createRecord({
            domain,
            record: Record.Twitter,
            content: "@sns",
            owner,
            payer: owner,
          })
        ).rejects.toThrow(InvalidDomainError);
      }
    );

    test.each([
      "sub.wallet-guide-9.sol",
      "sub.wallet-guide-9",
      "sub.wallet-guide-9.com",
    ])("createSubdomain rejects %s", async (subdomain) => {
      await expect(
        createSubdomain({ rpc: TEST_RPC, subdomain, owner })
      ).rejects.toThrow(UnsupportedTldError);
    });

    test.each(["wallet-guide-9.sol", "wallet-guide-9", "wallet-guide-9.com"])(
      "createRecord rejects %s",
      async (domain) => {
        await expect(
          createRecord({
            domain,
            record: Record.Twitter,
            content: "@test",
            owner,
            payer: owner,
          })
        ).rejects.toThrow(UnsupportedTldError);
      }
    );

    test.each(["wallet-guide-9.sol", "wallet-guide-9", "wallet-guide-9.com"])(
      "updateRecord rejects %s",
      async (domain) => {
        await expect(
          updateRecord({
            domain,
            record: Record.Twitter,
            content: "@sns",
            owner,
            payer: owner,
          })
        ).rejects.toThrow(UnsupportedTldError);
      }
    );

    test.each(["wallet-guide-9.sol", "wallet-guide-9", "wallet-guide-9.com"])(
      "deleteRecord rejects %s",
      async (domain) => {
        await expect(
          deleteRecord({
            domain,
            record: Record.Twitter,
            owner,
            payer: owner,
          })
        ).rejects.toThrow(UnsupportedTldError);
      }
    );
  });
});
