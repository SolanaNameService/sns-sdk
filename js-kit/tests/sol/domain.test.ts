import { describe, expect, jest, test } from "@jest/globals";

import { SYSTEM_PROGRAM_ADDRESS } from "../../src/constants/addresses";
import { getDomainAddress } from "../../src/domain/getDomainAddress";
import { getDomainOwner } from "../../src/domain/getDomainOwner";
import { getDomainRecord } from "../../src/domain/getDomainRecord";
import { getDomainRecords } from "../../src/domain/getDomainRecords";
import { getSubdomains } from "../../src/domain/getSubdomains";
import { AllowPda, resolveDomain } from "../../src/domain/resolveDomain";
import {
  InvalidRoAError,
  InvalidValidationError,
  MissingVerifierError,
  NoRecordDataError,
  PdaOwnerNotAllowedError,
} from "../../src/errors";
import { Record } from "../../src/types/record";
import { getReverseAddress } from "../../src/utils/getReverseAddress";
import { TEST_RPC } from "../constants";

jest.setTimeout(60_000);

describe("SOL domain reads", () => {
  describe("getDomainAddress", () => {
    test.each([
      {
        domain: "sns-ip-5-wallet-1.sol",
        address: "6qJtQdAJvAiSfGXWAuHDteAes6vnFcxtHmLzw1TStCrd",
      },
      {
        domain: "test.sns-ip-5-wallet-1.sol",
        address: "EzQAeEBXpZWpsZXcZRwV63RRr2RkwBVqdYN53tcbTDEm",
      },
    ])("$domain", async (item) => {
      const { domainAddress } = await getDomainAddress({ domain: item.domain });
      expect(domainAddress).toBe(item.address);
    });
  });

  describe("getDomainOwner", () => {
    test.each([
      {
        domain: "sns-ip-5-wallet-1.sol",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-2.sol",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-3.sol",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-4.sol",
        owner: "7PLHHJawDoa4PGJUK3mUnusV7SEVwZwEyV5csVzm86J4",
      },
      {
        domain: "sns-ip-5-wallet-5.sol",
        owner: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      },
      {
        domain: "sns-ip-5-wallet-6.sol",
        owner: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      },
      {
        domain: "sns-ip-5-wallet-7.sol",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-8.sol",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-9.sol",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-10.sol",
        owner: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      },
      {
        domain: "sns-ip-5-wallet-11.sol",
        owner: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      },
      {
        domain: "sns-ip-5-wallet-12.sol",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
    ])("$domain", async (item) => {
      const owner = await getDomainOwner({
        rpc: TEST_RPC,
        domain: item.domain,
      });
      expect(owner).toBe(item.owner);
    });
  });

  describe("records", () => {
    test.each([
      {
        domain: "wallet-guide-9.sol",
        record: Record.IPFS,
        value: "ipfs://test",
        verified: { staleness: true },
      },
      {
        domain: "wallet-guide-9.sol",
        record: Record.BTC,
        error: new NoRecordDataError("Record account not found"),
      },
      {
        domain: "wallet-guide-9.sol",
        record: Record.Email,
        value: "test@gmail.com",
        verified: { staleness: false },
      },
      {
        domain: "wallet-guide-9.sol",
        record: Record.Url,
        value: "https://google.com",
        verified: { staleness: false, rightOfAssociation: false },
      },
      {
        domain: "wallet-guide-9.sol",
        record: Record.ETH,
        error: new NoRecordDataError("Record account not found"),
      },
    ])("getDomainRecord $domain $record", async (item) => {
      if (item.value) {
        const res = await getDomainRecord({
          rpc: TEST_RPC,
          domain: item.domain,
          record: item.record,
          options: { deserialize: true },
        });
        expect(res.deserializedContent).toBe(item.value);
        expect(res.verified).toStrictEqual(item.verified);
      } else {
        await expect(
          getDomainRecord({
            rpc: TEST_RPC,
            domain: item.domain,
            record: item.record,
            options: { deserialize: true },
          })
        ).rejects.toThrow(item.error);
      }
    });

    test("getDomainRecords", async () => {
      const records = [
        {
          record: Record.IPFS,
          value: "ipfs://test",
          verified: { staleness: true },
        },
        { record: Record.BTC },
        {
          record: Record.Email,
          value: "test@gmail.com",
          verified: { staleness: false },
        },
        {
          record: Record.Url,
          value: "https://google.com",
          verified: { staleness: false, rightOfAssociation: false },
        },
        { record: Record.ETH },
      ];

      const res = await getDomainRecords({
        rpc: TEST_RPC,
        domain: "wallet-guide-9.sol",
        records: records.map((item) => item.record),
        options: {
          deserialize: true,
          verifiers: records.map(() => undefined),
        },
      });

      records.forEach((record, idx) => {
        if (record.value) {
          expect(res[idx]?.deserializedContent).toBe(record.value);
          expect(res[idx]?.verified).toStrictEqual(record.verified);
        } else {
          expect(res[idx]).toBe(undefined);
        }
      });

      await expect(
        getDomainRecords({
          rpc: TEST_RPC,
          domain: "wallet-guide-9.sol",
          records: records.map((item) => item.record),
          options: { deserialize: true, verifiers: [] },
        })
      ).rejects.toThrow(
        new MissingVerifierError(
          "The number of verifiers must be the same as the number of records"
        )
      );
    });
  });

  describe("getSubdomains", () => {
    test("wallet-guide-9.sol", async () => {
      const subs = await getSubdomains({
        rpc: TEST_RPC,
        domain: "wallet-guide-9.sol",
      });
      expect(subs).toStrictEqual([
        {
          subdomain: "sub-0",
          owner: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
        },
      ]);
    });
  });

  describe("getReverseAddress", () => {
    test.each([
      {
        domain: "wallet-guide-9.sol",
        reverseAddress: "3axszxf72aQRfKH19KedytU3D7s8wjrUGPwsrrp3obxz",
      },
      {
        domain: "sub-0.wallet-guide-9.sol",
        reverseAddress: "D8Nc3uhfxZbnxAcUrmWQAS5tStgmA5BHrjbRxjGwPaLS",
      },
    ])("$domain", async ({ domain, reverseAddress }) => {
      await expect(getReverseAddress(domain)).resolves.toBe(reverseAddress);
    });
  });

  describe("resolveDomain", () => {
    test.each([
      {
        domain: "sns-ip-5-wallet-1.sol",
        result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-2.sol",
        result: "AxwzQXhZNJb9zLyiHUQA12L2GL7CxvUNrp6neee6r3cA",
      },
      {
        domain: "sns-ip-5-wallet-4.sol",
        result: "7PLHHJawDoa4PGJUK3mUnusV7SEVwZwEyV5csVzm86J4",
      },
      {
        domain: "sns-ip-5-wallet-5.sol",
        result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
        options: { allowPda: true, programIds: [SYSTEM_PROGRAM_ADDRESS] },
      },
      {
        domain: "sns-ip-5-wallet-5.sol",
        result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
        options: { allowPda: "any" as AllowPda },
      },
      {
        domain: "sns-ip-5-wallet-7.sol",
        result: "53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH",
      },
      {
        domain: "sns-ip-5-wallet-8.sol",
        result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-9.sol",
        result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-10.sol",
        result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
        options: { allowPda: true, programIds: [SYSTEM_PROGRAM_ADDRESS] },
      },
      {
        domain: "sns-ip-5-wallet-10.sol",
        result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
        options: { allowPda: "any" as AllowPda },
      },
      {
        domain: "wallet-guide-5.sol",
        result: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
      },
      {
        domain: "wallet-guide-4.sol",
        result: "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ",
      },
      {
        domain: "wallet-guide-3.sol",
        result: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
      },
      {
        domain: "wallet-guide-2.sol",
        result: "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4",
      },
      {
        domain: "wallet-guide-1.sol",
        result: "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4",
      },
      {
        domain: "wallet-guide-0.sol",
        result: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
      },
      {
        domain: "sub-0.wallet-guide-3.sol",
        result: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
      },
      {
        domain: "sub-1.wallet-guide-3.sol",
        result: "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ",
      },
      {
        domain: "wallet-guide-6.sol",
        result: "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ",
      },
      {
        domain: "wallet-guide-8.sol",
        result: "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4",
      },
    ])("$domain resolves correctly", async (e) => {
      const resolvedValue = await resolveDomain({
        rpc: TEST_RPC,
        domain: e.domain,
        options: e.options,
      });
      expect(resolvedValue.toString()).toBe(e.result);
    });

    test.each([
      { domain: "sns-ip-5-wallet-3.sol", error: new InvalidValidationError() },
      { domain: "sns-ip-5-wallet-6.sol", error: new PdaOwnerNotAllowedError() },
      {
        domain: "sns-ip-5-wallet-11.sol",
        error: new PdaOwnerNotAllowedError(),
      },
      { domain: "sns-ip-5-wallet-12.sol", error: new InvalidRoAError() },
    ])("$domain throws correctly", async (e) => {
      await expect(
        resolveDomain({ rpc: TEST_RPC, domain: e.domain })
      ).rejects.toThrow(e.error);
    });
  });
});
