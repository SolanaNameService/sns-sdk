import { describe, expect, test } from "@jest/globals";

import { getSrsDomainAddress } from "../src/domain/getSrsDomainAddress";
import { uint8ArrayToHex } from "../src/utils/uint8Array/uint8ArrayToHex";

describe("getSrsDomainAddress", () => {
  test.each([
    {
      domain: "example",
      domainAddress: "BtnBwXquD42ehaVbfJQdmoFeB6kS3aooPzhfQmH4FM2N",
      hash: "5b96a5f79408e4401cdc30fb60f37cffecabc23b16d26b80169e6fb8a0df02dc",
    },
    {
      domain: "sub.example",
      domainAddress: "9KM3Le7YRzJY3sn6gk7RsBZsEsViTRc4wb8boszLEuk7",
      hash: "87f20401c8a32a2417a22e2b29ccbe2a8fa8cbd2686a073b40bd27b55b740c6b",
    },
  ])("derives $domain", async ({ domain, domainAddress, hash }) => {
    const result = await getSrsDomainAddress({ domain });

    expect(result.domainAddress).toBe(domainAddress);
    expect(uint8ArrayToHex(result.hashed)).toBe(hash);
  });
});
