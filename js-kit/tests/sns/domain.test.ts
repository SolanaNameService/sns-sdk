import { describe, expect, jest, test } from "@jest/globals";

import { SYSTEM_PROGRAM_ADDRESS } from "../../src/constants/addresses";
import { getDomainAddress } from "../../src/domain/getDomainAddress";
import { getDomainOwner } from "../../src/domain/getDomainOwner";
import { getDomainRecord } from "../../src/domain/getDomainRecord";
import { getDomainRecords } from "../../src/domain/getDomainRecords";
import { getSubdomains } from "../../src/domain/getSubdomains";
import { ResolveOptions, resolve } from "../../src/domain/resolve";
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

describe("SNS domain reads", () => {
  describe("getDomainAddress", () => {
    test.each([
      {
        domain: "sns-ip-5-wallet-1.sns",
        address: "6qJtQdAJvAiSfGXWAuHDteAes6vnFcxtHmLzw1TStCrd",
      },
      {
        domain: "test.sns-ip-5-wallet-1.sns",
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
        domain: "sns-ip-5-wallet-1.sns",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-2.sns",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-3.sns",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-4.sns",
        owner: "7PLHHJawDoa4PGJUK3mUnusV7SEVwZwEyV5csVzm86J4",
      },
      {
        domain: "sns-ip-5-wallet-5.sns",
        owner: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      },
      {
        domain: "sns-ip-5-wallet-6.sns",
        owner: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      },
      {
        domain: "sns-ip-5-wallet-7.sns",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-8.sns",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-9.sns",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-10.sns",
        owner: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      },
      {
        domain: "sns-ip-5-wallet-11.sns",
        owner: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
      },
      {
        domain: "sns-ip-5-wallet-12.sns",
        owner: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
    ])("$domain", async (item) => {
      const res = await getDomainOwner({ rpc: TEST_RPC, domain: item.domain });
      expect(res).toBe(item.owner);
    });
  });

  describe("records", () => {
    test.each([
      {
        domain: "wallet-guide-9.sns",
        record: Record.IPFS,
        value: "ipfs://test",
        verified: { staleness: true },
      },
      {
        domain: "wallet-guide-9.sns",
        record: Record.BTC,
        error: new NoRecordDataError("Record account not found"),
      },
      {
        domain: "wallet-guide-9.sns",
        record: Record.Email,
        value: "test@gmail.com",
        verified: { staleness: false },
      },
      {
        domain: "wallet-guide-9.sns",
        record: Record.Url,
        value: "https://google.com",
        verified: { staleness: false, roa: false },
      },
      {
        domain: "wallet-guide-9.sns",
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
      const domain = "wallet-guide-9.sns";
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
          verified: { staleness: false, roa: false },
        },
        { record: Record.ETH },
      ];

      const res = await getDomainRecords({
        rpc: TEST_RPC,
        domain,
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
          domain,
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
    test("wallet-guide-9.sns", async () => {
      const subs = await getSubdomains({
        rpc: TEST_RPC,
        domain: "wallet-guide-9.sns",
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
        domain: "wallet-guide-9.sns",
        reverseAddress: "3axszxf72aQRfKH19KedytU3D7s8wjrUGPwsrrp3obxz",
      },
      {
        domain: "sub-0.wallet-guide-9.sns",
        reverseAddress: "D8Nc3uhfxZbnxAcUrmWQAS5tStgmA5BHrjbRxjGwPaLS",
      },
    ])("$domain", async ({ domain, reverseAddress }) => {
      await expect(getReverseAddress(domain)).resolves.toBe(reverseAddress);
    });
  });

  describe("resolve", () => {
    test.each([
      {
        domain: "sns-ip-5-wallet-1.sns",
        result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-2.sns",
        result: "AxwzQXhZNJb9zLyiHUQA12L2GL7CxvUNrp6neee6r3cA",
      },
      {
        domain: "sns-ip-5-wallet-4.sns",
        result: "7PLHHJawDoa4PGJUK3mUnusV7SEVwZwEyV5csVzm86J4",
      },
      {
        domain: "sns-ip-5-wallet-5.sns",
        result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
        options: {
          allowPda: true,
          programIds: [SYSTEM_PROGRAM_ADDRESS],
        } as ResolveOptions,
      },
      {
        domain: "sns-ip-5-wallet-5.sns",
        result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
        options: { allowPda: "any" } as ResolveOptions,
      },
      {
        domain: "sns-ip-5-wallet-7.sns",
        result: "53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH",
      },
      {
        domain: "sns-ip-5-wallet-8.sns",
        result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-9.sns",
        result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
      },
      {
        domain: "sns-ip-5-wallet-10.sns",
        result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
        options: {
          allowPda: true,
          programIds: [SYSTEM_PROGRAM_ADDRESS],
        } as ResolveOptions,
      },
      {
        domain: "sns-ip-5-wallet-10.sns",
        result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
        options: { allowPda: "any" } as ResolveOptions,
      },
      {
        domain: "wallet-guide-5.sns",
        result: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
      },
      {
        domain: "wallet-guide-4.sns",
        result: "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ",
      },
      {
        domain: "wallet-guide-3.sns",
        result: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
      },
      {
        domain: "wallet-guide-2.sns",
        result: "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4",
      },
      {
        domain: "wallet-guide-1.sns",
        result: "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4",
      },
      {
        domain: "wallet-guide-0.sns",
        result: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
      },
      {
        domain: "sub-0.wallet-guide-3.sns",
        result: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
      },
      {
        domain: "sub-1.wallet-guide-3.sns",
        result: "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ",
      },
      {
        domain: "wallet-guide-6.sns",
        result: "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ",
      },
      {
        domain: "wallet-guide-8.sns",
        result: "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4",
      },
    ])("$domain resolves correctly", async (e) => {
      const resolvedValue = await resolve({
        rpc: TEST_RPC,
        domain: e.domain,
        options: e.options,
      });
      expect(resolvedValue.toString()).toBe(e.result);
    });

    test.each([
      { domain: "sns-ip-5-wallet-3.sns", error: new InvalidValidationError() },
      { domain: "sns-ip-5-wallet-6.sns", error: new PdaOwnerNotAllowedError() },
      {
        domain: "sns-ip-5-wallet-11.sns",
        error: new PdaOwnerNotAllowedError(),
      },
      { domain: "sns-ip-5-wallet-12.sns", error: new InvalidRoAError() },
    ])("$domain throws correctly", async (e) => {
      await expect(
        resolve({ rpc: TEST_RPC, domain: e.domain })
      ).rejects.toThrow(e.error);
    });
  });
});
